export declare class AddressResponseDto {
    id: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    district?: string;
    is_primary: boolean;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
}
export declare class ContactResponseDto {
    id: string;
    contact_type: string;
    contact_value: string;
    is_primary: boolean;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
}
export declare class DocumentResponseDto {
    id: string;
    document_type: string;
    document_number: string;
    is_primary: boolean;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
}
export declare class LeadResponseDto {
    id: string;
    lead_type: string;
    lead_status: string;
    lead_temperature: string;
    lead_origin: string;
    lead_description: string;
    lead_notes: string[];
    first_contacted_by: string;
    person_id: string;
    full_name: string;
    document_type: string;
    document_number: string;
    addresses: AddressResponseDto[];
    contacts: ContactResponseDto[];
    other_documents: DocumentResponseDto[];
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
}
