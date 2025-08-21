import { AddressResponseDto, ContactResponseDto, DocumentResponseDto } from '../Leads/lead-response.dto';
export declare class CustomerResponseDto {
    id: string;
    customer_type: string;
    customer_status: string;
    fidelized_by: string;
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
