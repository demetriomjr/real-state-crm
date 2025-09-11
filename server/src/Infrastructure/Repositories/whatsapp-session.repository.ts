import { Injectable } from "@nestjs/common";
import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { WhatsappSession } from "@/Domain/WhatsappSession/WhatsappSession";
import {
  WhatsappSessionCreateDto,
  WhatsappSessionUpdateDto,
} from "@/Application/DTOs/WhatsappSession";

@Injectable()
export class WhatsappSessionRepository {
  constructor(private readonly prisma: MainDatabaseContext) {}

  async findAll(tenantId: string): Promise<WhatsappSession[]> {
    const sessions = await this.prisma.whatsappSession.findMany({
      where: {
        tenant_id: tenantId,
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return sessions.map(
      (session) =>
        new WhatsappSession({
          ...session,
          status: session.status as
            | "pending"
            | "connected"
            | "disconnected"
            | "error",
        }),
    );
  }

  async findOne(id: string): Promise<WhatsappSession | null> {
    const session = await this.prisma.whatsappSession.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });
    return session
      ? new WhatsappSession({
          ...session,
          status: session.status as
            | "pending"
            | "connected"
            | "disconnected"
            | "error",
        })
      : null;
  }

  async findByName(sessionName: string): Promise<WhatsappSession | null> {
    const session = await this.prisma.whatsappSession.findFirst({
      where: {
        session_name: sessionName,
        deleted_at: null,
      },
    });
    return session
      ? new WhatsappSession({
          ...session,
          status: session.status as
            | "pending"
            | "connected"
            | "disconnected"
            | "error",
        })
      : null;
  }

  async create(
    createSessionDto: WhatsappSessionCreateDto,
  ): Promise<WhatsappSession> {
    const session = await this.prisma.whatsappSession.create({
      data: {
        tenant_id: createSessionDto.tenant_id,
        session_name: createSessionDto.session_name,
        phone_number: createSessionDto.phone_number,
        status: "pending",
      },
    });
    return new WhatsappSession({
      ...session,
      status: session.status as
        | "pending"
        | "connected"
        | "disconnected"
        | "error",
    });
  }

  async update(
    id: string,
    updateSessionDto: WhatsappSessionUpdateDto,
  ): Promise<WhatsappSession> {
    const session = await this.prisma.whatsappSession.update({
      where: { id },
      data: {
        ...(updateSessionDto.session_name && {
          session_name: updateSessionDto.session_name,
        }),
        ...(updateSessionDto.phone_number && {
          phone_number: updateSessionDto.phone_number,
        }),
        ...(updateSessionDto.status && {
          status: updateSessionDto.status,
        }),

        ...(updateSessionDto.last_activity_at && {
          last_activity_at: updateSessionDto.last_activity_at,
        }),
      },
    });
    return new WhatsappSession({
      ...session,
      status: session.status as
        | "pending"
        | "connected"
        | "disconnected"
        | "error",
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.whatsappSession.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async updateStatus(id: string, status: string): Promise<WhatsappSession> {
    const session = await this.prisma.whatsappSession.update({
      where: { id },
      data: {
        status,
        last_activity_at: new Date(),
      },
    });
    return new WhatsappSession({
      ...session,
      status: session.status as
        | "pending"
        | "connected"
        | "disconnected"
        | "error",
    });
  }

  async updatePhoneNumber(
    id: string,
    phoneNumber: string,
  ): Promise<WhatsappSession> {
    const session = await this.prisma.whatsappSession.update({
      where: { id },
      data: {
        phone_number: phoneNumber,
        last_activity_at: new Date(),
      },
    });
    return new WhatsappSession({
      ...session,
      status: session.status as
        | "pending"
        | "connected"
        | "disconnected"
        | "error",
    });
  }
}
