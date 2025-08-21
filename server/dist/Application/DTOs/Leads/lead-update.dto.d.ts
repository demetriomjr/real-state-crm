import { AddressDto, ContactDto, DocumentDto } from './lead-create.dto';
export declare class LeadUpdateDto {
    full_name?: string;
    document_type?: string;
    document_number?: string;
    lead_type?: string;
    lead_status?: string;
    lead_temperature?: string;
    lead_origin?: string;
    lead_description?: string;
    lead_notes?: string[];
    first_contacted_by?: string;
    addresses?: AddressDto[];
    contacts?: ContactDto[];
    other_documents?: DocumentDto[];
}
