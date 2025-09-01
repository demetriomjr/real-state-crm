import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { LeadService } from "@/Application/Services/lead.service";
import { LeadCreateDto } from "@/Application/DTOs/Leads/lead-create.dto";
import { LeadUpdateDto } from "@/Application/DTOs/Leads/lead-update.dto";
import { LeadResponseDto } from "@/Application/DTOs/Leads/lead-response.dto";
import { JwtAuthGuard } from "@/Application/Features/auth.guard";

@Controller("leads")
@UseGuards(JwtAuthGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  async createLead(
    @Body() createLeadDto: LeadCreateDto,
    @Request() req: any,
  ): Promise<LeadResponseDto> {
    const userId = req.user?.id;

    // Extract lead and person data from the DTO
    const {
      lead_type,
      lead_status,
      lead_temperature,
      lead_origin,
      lead_description,
      lead_notes,
      first_contacted_by,
      full_name,
      document_type,
      document_number,
      addresses,
      contacts,
      other_documents,
    } = createLeadDto;

    const leadData = {
      lead_type,
      lead_status,
      lead_temperature,
      lead_origin,
      lead_description,
      lead_notes,
      first_contacted_by,
    };

    const personData = {
      full_name,
      document_type,
      document_number,
      addresses,
      contacts,
      documents: other_documents,
    };

    const createdLead = await this.leadService.createLead(
      leadData,
      personData,
      userId,
    );
    return createdLead;
  }

  @Get()
  async getAllLeads(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ): Promise<{
    leads: LeadResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await this.leadService.getAllLeads(pageNum, limitNum);

    return {
      ...result,
      leads: result.leads,
    };
  }

  @Get(":id")
  async getLeadById(@Param("id") id: string): Promise<LeadResponseDto> {
    const lead = await this.leadService.getLeadById(id);
    return lead;
  }

  @Put(":id")
  async updateLead(
    @Param("id") id: string,
    @Body() updateLeadDto: LeadUpdateDto,
    @Request() req: any,
  ): Promise<LeadResponseDto> {
    const userId = req.user?.id;

    // Extract lead and person data from the DTO
    const {
      lead_type,
      lead_status,
      lead_temperature,
      lead_origin,
      lead_description,
      lead_notes,
      first_contacted_by,
      full_name,
      document_type,
      document_number,
      addresses,
      contacts,
      other_documents,
    } = updateLeadDto;

    const leadData = {
      lead_type,
      lead_status,
      lead_temperature,
      lead_origin,
      lead_description,
      lead_notes,
      first_contacted_by,
    };

    const personData = {
      full_name,
      document_type,
      document_number,
      addresses,
      contacts,
      documents: other_documents,
    };

    const updatedLead = await this.leadService.updateLead(
      id,
      leadData,
      personData,
      userId,
    );
    return updatedLead;
  }

  @Delete(":id")
  async deleteLead(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    const userId = req.user?.id;
    await this.leadService.deleteLead(id, userId);
    return { message: "Lead deleted successfully" };
  }
}
