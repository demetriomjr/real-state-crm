export declare class AddressDto {
    id?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    district?: string;
    is_primary?: boolean;
}
export declare class ContactDto {
    id?: string;
    contact_type: string;
    contact_value: string;
    is_primary?: boolean;
}
export declare class DocumentDto {
    id?: string;
    document_type: string;
    document_number: string;
    is_primary?: boolean;
}
export declare class LeadCreateDto {
    full_name: string;
    document_type: string;
    document_number: string;
    lead_type: string;
    lead_status: string;
    lead_temperature: string;
    lead_origin: string;
    lead_description: string;
    lead_notes?: string[];
    first_contacted_by: string;
    addresses?: AddressDto[];
    contacts?: ContactDto[];
    other_documents?: DocumentDto[];
}
