import { LeadService } from "@/Application/Services/lead.service";
import { LeadCreateDto } from "@/Application/DTOs/Leads/lead-create.dto";
import { LeadUpdateDto } from "@/Application/DTOs/Leads/lead-update.dto";
import { LeadResponseDto } from "@/Application/DTOs/Leads/lead-response.dto";
export declare class LeadController {
    private readonly leadService;
    constructor(leadService: LeadService);
    createLead(createLeadDto: LeadCreateDto, req: any): Promise<LeadResponseDto>;
    getAllLeads(page?: string, limit?: string): Promise<{
        leads: LeadResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getLeadById(id: string): Promise<LeadResponseDto>;
    updateLead(id: string, updateLeadDto: LeadUpdateDto, req: any): Promise<LeadResponseDto>;
    deleteLead(id: string, req: any): Promise<{
        message: string;
    }>;
}
