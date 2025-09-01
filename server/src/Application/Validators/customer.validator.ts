import { Injectable, BadRequestException, Logger } from "@nestjs/common";

@Injectable()
export class CustomerValidator {
  private readonly logger = new Logger(CustomerValidator.name);

  // Expected customer types
  private readonly expectedCustomerTypes = ["individual", "company"];

  // Expected customer statuses
  private readonly expectedCustomerStatuses = ["active", "inactive"];

  async validateCreate(data: any): Promise<void> {
    this.logger.log("Validating customer creation data");

    // Validate customer_type
    if (!data.customer_type || typeof data.customer_type !== "string") {
      throw new BadRequestException(
        "Customer type is required and must be a string",
      );
    }

    if (
      !this.expectedCustomerTypes.includes(data.customer_type.toLowerCase())
    ) {
      throw new BadRequestException(
        `Customer type must be one of: ${this.expectedCustomerTypes.join(", ")}`,
      );
    }

    // Validate customer_status
    if (!data.customer_status || typeof data.customer_status !== "string") {
      throw new BadRequestException(
        "Customer status is required and must be a string",
      );
    }

    if (
      !this.expectedCustomerStatuses.includes(
        data.customer_status.toLowerCase(),
      )
    ) {
      throw new BadRequestException(
        `Customer status must be one of: ${this.expectedCustomerStatuses.join(", ")}`,
      );
    }

    // Validate fidelized_by (optional)
    if (data.fidelized_by !== undefined && data.fidelized_by !== null) {
      if (typeof data.fidelized_by !== "string") {
        throw new BadRequestException("Fidelized by must be a string");
      }

      // Basic UUID validation for fidelized_by
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(data.fidelized_by)) {
        throw new BadRequestException("Fidelized by must be a valid UUID");
      }
    }

    this.logger.log("Customer creation data validation passed");
  }

  async validateUpdate(data: any): Promise<void> {
    this.logger.log("Validating customer update data");

    // Validate customer_type if provided
    if (data.customer_type !== undefined) {
      if (typeof data.customer_type !== "string") {
        throw new BadRequestException("Customer type must be a string");
      }

      if (
        !this.expectedCustomerTypes.includes(data.customer_type.toLowerCase())
      ) {
        throw new BadRequestException(
          `Customer type must be one of: ${this.expectedCustomerTypes.join(", ")}`,
        );
      }
    }

    // Validate customer_status if provided
    if (data.customer_status !== undefined) {
      if (typeof data.customer_status !== "string") {
        throw new BadRequestException("Customer status must be a string");
      }

      if (
        !this.expectedCustomerStatuses.includes(
          data.customer_status.toLowerCase(),
        )
      ) {
        throw new BadRequestException(
          `Customer status must be one of: ${this.expectedCustomerStatuses.join(", ")}`,
        );
      }
    }

    // Validate fidelized_by if provided
    if (data.fidelized_by !== undefined && data.fidelized_by !== null) {
      if (typeof data.fidelized_by !== "string") {
        throw new BadRequestException("Fidelized by must be a string");
      }

      // Basic UUID validation for fidelized_by
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(data.fidelized_by)) {
        throw new BadRequestException("Fidelized by must be a valid UUID");
      }
    }

    this.logger.log("Customer update data validation passed");
  }
}
