import { AddressDto, ContactDto, DocumentDto } from "../Leads/lead-create.dto";
export declare class CustomerUpdateDto {
    full_name?: string;
    document_type?: string;
    document_number?: string;
    customer_type?: string;
    customer_status?: string;
    fidelized_by?: string;
    addresses?: AddressDto[];
    contacts?: ContactDto[];
    other_documents?: DocumentDto[];
}
