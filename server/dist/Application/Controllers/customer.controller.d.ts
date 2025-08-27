import { CustomerService } from '@/Application/Services/customer.service';
import { CustomerCreateDto } from '@/Application/DTOs/Customers/customer-create.dto';
import { CustomerUpdateDto } from '@/Application/DTOs/Customers/customer-update.dto';
import { CustomerResponseDto } from '@/Application/DTOs/Customers/customer-response.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    createCustomer(createCustomerDto: CustomerCreateDto, req: any): Promise<CustomerResponseDto>;
    getAllCustomers(page?: string, limit?: string): Promise<{
        customers: CustomerResponseDto[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getCustomerById(id: string): Promise<CustomerResponseDto>;
    updateCustomer(id: string, updateCustomerDto: CustomerUpdateDto, req: any): Promise<CustomerResponseDto>;
    deleteCustomer(id: string, req: any): Promise<{
        message: string;
    }>;
    convertLeadToCustomer(leadId: string, customerData: any, req: any): Promise<CustomerResponseDto>;
}
