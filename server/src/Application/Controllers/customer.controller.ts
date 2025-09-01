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
import { CustomerService } from "@/Application/Services/customer.service";
import { CustomerCreateDto } from "@/Application/DTOs/Customers/customer-create.dto";
import { CustomerUpdateDto } from "@/Application/DTOs/Customers/customer-update.dto";
import { CustomerResponseDto } from "@/Application/DTOs/Customers/customer-response.dto";
import { JwtAuthGuard } from "@/Application/Features/auth.guard";

@Controller("customers")
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CustomerCreateDto,
    @Request() req: any,
  ): Promise<CustomerResponseDto> {
    const userId = req.user?.id;

    // Extract customer and person data from the DTO
    const {
      customer_type,
      customer_status,
      fidelized_by,
      full_name,
      document_type,
      document_number,
      addresses,
      contacts,
      other_documents,
    } = createCustomerDto;

    const customerData = {
      customer_type,
      customer_status,
      fidelized_by,
    };

    const personData = {
      full_name,
      document_type,
      document_number,
      addresses,
      contacts,
      documents: other_documents,
    };

    const createdCustomer = await this.customerService.createCustomer(
      customerData,
      personData,
      userId,
    );
    return createdCustomer;
  }

  @Get()
  async getAllCustomers(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
  ): Promise<{
    customers: CustomerResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const result = await this.customerService.getAllCustomers(
      pageNum,
      limitNum,
    );

    return {
      ...result,
      customers: result.customers,
    };
  }

  @Get(":id")
  async getCustomerById(@Param("id") id: string): Promise<CustomerResponseDto> {
    const customer = await this.customerService.getCustomerById(id);
    return customer;
  }

  @Put(":id")
  async updateCustomer(
    @Param("id") id: string,
    @Body() updateCustomerDto: CustomerUpdateDto,
    @Request() req: any,
  ): Promise<CustomerResponseDto> {
    const userId = req.user?.id;

    // Extract customer and person data from the DTO
    const {
      customer_type,
      customer_status,
      fidelized_by,
      full_name,
      document_type,
      document_number,
      addresses,
      contacts,
      other_documents,
    } = updateCustomerDto;

    const customerData = {
      customer_type,
      customer_status,
      fidelized_by,
    };

    const personData = {
      full_name,
      document_type,
      document_number,
      addresses,
      contacts,
      documents: other_documents,
    };

    const updatedCustomer = await this.customerService.updateCustomer(
      id,
      customerData,
      personData,
      userId,
    );
    return updatedCustomer;
  }

  @Delete(":id")
  async deleteCustomer(
    @Param("id") id: string,
    @Request() req: any,
  ): Promise<{ message: string }> {
    const userId = req.user?.id;
    await this.customerService.deleteCustomer(id, userId);
    return { message: "Customer deleted successfully" };
  }

  @Post("convert-from-lead/:leadId")
  async convertLeadToCustomer(
    @Param("leadId") leadId: string,
    @Body() customerData: any,
    @Request() req: any,
  ): Promise<CustomerResponseDto> {
    const userId = req.user?.id;
    const customer = await this.customerService.convertLeadToCustomer(
      leadId,
      customerData,
      userId,
    );
    return customer;
  }
}
