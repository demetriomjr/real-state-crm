import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { WhatsappSession } from "@/Domain/WhatsappSession/WhatsappSession";
import { WhatsappSessionCreateDto, WhatsappSessionUpdateDto, WhatsappSessionResponseDto } from "@/Application/DTOs/WhatsappSession";
import axios from "axios";

@Injectable()
export class WhatsappSessionService {
  private readonly logger = new Logger(WhatsappSessionService.name);
  private readonly wahaBaseUrl = "http://waha:3000/api";

  constructor(private readonly whatsappSessionRepository: WhatsappSessionRepository) {}

  async findAll(tenantId: string): Promise<WhatsappSessionResponseDto[]> {
    const sessions = await this.whatsappSessionRepository.findAll(tenantId);
    return sessions.map((session) => this.mapSessionToResponseDto(session));
  }

  async findOne(id: string, tenantId: string): Promise<WhatsappSessionResponseDto> {
    const session = await this.whatsappSessionRepository.findOne(id);
    if (!session || session.tenant_id !== tenantId) {
      throw new NotFoundException("WhatsApp session not found");
    }
    return this.mapSessionToResponseDto(session);
  }

  async create(createSessionDto: WhatsappSessionCreateDto): Promise<WhatsappSessionResponseDto> {
    this.logger.log(`Creating WhatsApp session: ${createSessionDto.session_name}`);

    // Create session in database
    const session = await this.whatsappSessionRepository.create(createSessionDto);

    try {
      // Create session in WAHA
      await this.createWahaSession(session.session_id, createSessionDto.phone_number);

      // Start session and get QR code
      const qrCodeData = await this.startWahaSession(session.session_id);
      
      // Update session with QR code
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 2); // QR codes typically expire in 2 minutes
      
      const updatedSession = await this.whatsappSessionRepository.updateQRCode(
        session.id,
        qrCodeData.qr || "",
        expiresAt
      );

      this.logger.log(`WhatsApp session created successfully: ${session.session_id}`);
      return this.mapSessionToResponseDto(updatedSession);
    } catch (error) {
      // If WAHA creation fails, delete the database record
      await this.whatsappSessionRepository.delete(session.id);
      this.logger.error(`Failed to create WAHA session: ${error.message}`);
      throw new BadRequestException(`Failed to create WhatsApp session: ${error.message}`);
    }
  }

  async update(id: string, updateSessionDto: WhatsappSessionUpdateDto, tenantId: string): Promise<WhatsappSessionResponseDto> {
    const session = await this.whatsappSessionRepository.findOne(id);
    if (!session || session.tenant_id !== tenantId) {
      throw new NotFoundException("WhatsApp session not found");
    }

    const updatedSession = await this.whatsappSessionRepository.update(id, updateSessionDto);
    return this.mapSessionToResponseDto(updatedSession);
  }

  async delete(id: string, tenantId: string): Promise<void> {
    const session = await this.whatsappSessionRepository.findOne(id);
    if (!session || session.tenant_id !== tenantId) {
      throw new NotFoundException("WhatsApp session not found");
    }

    try {
      // Delete session from WAHA
      await this.deleteWahaSession(session.session_id);
    } catch (error) {
      this.logger.warn(`Failed to delete WAHA session: ${error.message}`);
    }

    await this.whatsappSessionRepository.delete(id);
  }

  async refreshQRCode(id: string, tenantId: string): Promise<WhatsappSessionResponseDto> {
    const session = await this.whatsappSessionRepository.findOne(id);
    if (!session || session.tenant_id !== tenantId) {
      throw new NotFoundException("WhatsApp session not found");
    }

    if (session.status === "connected") {
      throw new BadRequestException("Cannot refresh QR code for connected session");
    }

    try {
      // Restart session in WAHA to get new QR code
      const qrCodeData = await this.startWahaSession(session.session_id);
      
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 2);
      
      const updatedSession = await this.whatsappSessionRepository.updateQRCode(
        session.id,
        qrCodeData.qr || "",
        expiresAt
      );

      return this.mapSessionToResponseDto(updatedSession);
    } catch (error) {
      this.logger.error(`Failed to refresh QR code: ${error.message}`);
      throw new BadRequestException(`Failed to refresh QR code: ${error.message}`);
    }
  }

  async getSessionState(id: string, tenantId: string): Promise<any> {
    const session = await this.whatsappSessionRepository.findOne(id);
    if (!session || session.tenant_id !== tenantId) {
      throw new NotFoundException("WhatsApp session not found");
    }

    try {
      const state = await this.getWahaSessionState(session.session_id);
      return state;
    } catch (error) {
      this.logger.error(`Failed to get session state: ${error.message}`);
      throw new BadRequestException(`Failed to get session state: ${error.message}`);
    }
  }

  // WAHA API Integration Methods
  private async createWahaSession(sessionId: string, phoneNumber?: string): Promise<any> {
    const payload: any = {
      name: sessionId,
      config: {
        webhook: "http://n8n:5678/webhook/waha-inbound",
        webhookByEvents: false,
        webhookBase64: false,
      },
    };

    if (phoneNumber) {
      payload.config.phoneNumber = phoneNumber;
    }

    const response = await axios.post(`${this.wahaBaseUrl}/sessions/add`, payload);
    return response.data;
  }

  private async startWahaSession(sessionId: string): Promise<any> {
    const response = await axios.get(`${this.wahaBaseUrl}/${sessionId}/start`);
    return response.data;
  }

  private async deleteWahaSession(sessionId: string): Promise<void> {
    await axios.delete(`${this.wahaBaseUrl}/sessions/${sessionId}`);
  }

  private async getWahaSessionState(sessionId: string): Promise<any> {
    const response = await axios.get(`${this.wahaBaseUrl}/${sessionId}/state`);
    return response.data;
  }

  // Helper method to map domain entity to response DTO
  private mapSessionToResponseDto(session: WhatsappSession): WhatsappSessionResponseDto {
    return {
      id: session.id,
      tenant_id: session.tenant_id,
      session_id: session.session_id,
      session_name: session.session_name,
      status: session.status as "pending" | "connected" | "disconnected" | "error",
      qr_code: session.qr_code,
      qr_code_expires_at: session.qr_code_expires_at,
      phone_number: session.phone_number,
      last_activity_at: session.last_activity_at,
      created_at: session.created_at,
      updated_at: session.updated_at,
    };
  }
}
