import { Injectable, BadRequestException, Logger } from "@nestjs/common";

@Injectable()
export class AddressValidator {
  private readonly logger = new Logger(AddressValidator.name);

  async validateCreate(data: any): Promise<void> {
    this.logger.log("Validating address creation data");

    // Validate address_line_1
    if (!data.address_line_1 || typeof data.address_line_1 !== "string") {
      throw new BadRequestException(
        "Address line 1 is required and must be a string",
      );
    }

    if (!data.address_line_1.trim()) {
      throw new BadRequestException("Address line 1 cannot be empty");
    }

    if (data.address_line_1.length > 200) {
      throw new BadRequestException(
        "Address line 1 must not exceed 200 characters",
      );
    }

    // Validate city
    if (!data.city || typeof data.city !== "string") {
      throw new BadRequestException("City is required and must be a string");
    }

    if (!data.city.trim()) {
      throw new BadRequestException("City cannot be empty");
    }

    if (data.city.length > 100) {
      throw new BadRequestException("City must not exceed 100 characters");
    }

    // Validate state
    if (!data.state || typeof data.state !== "string") {
      throw new BadRequestException("State is required and must be a string");
    }

    if (!data.state.trim()) {
      throw new BadRequestException("State cannot be empty");
    }

    if (data.state.length > 50) {
      throw new BadRequestException("State must not exceed 50 characters");
    }

    // Validate country
    if (!data.country || typeof data.country !== "string") {
      throw new BadRequestException("Country is required and must be a string");
    }

    if (!data.country.trim()) {
      throw new BadRequestException("Country cannot be empty");
    }

    if (data.country.length > 100) {
      throw new BadRequestException("Country must not exceed 100 characters");
    }

    // Validate zip_code
    if (!data.zip_code || typeof data.zip_code !== "string") {
      throw new BadRequestException(
        "ZIP code is required and must be a string",
      );
    }

    if (!data.zip_code.trim()) {
      throw new BadRequestException("ZIP code cannot be empty");
    }

    if (data.zip_code.length > 20) {
      throw new BadRequestException("ZIP code must not exceed 20 characters");
    }

    // Validate district (optional but if provided, must not be empty)
    if (data.district !== undefined && data.district !== null) {
      if (typeof data.district !== "string") {
        throw new BadRequestException("District must be a string");
      }

      if (data.district.trim() === "") {
        throw new BadRequestException("District cannot be empty if provided");
      }

      if (data.district.length > 100) {
        throw new BadRequestException(
          "District must not exceed 100 characters",
        );
      }
    }

    // Validate address_line_2 (optional but if provided, must not be empty)
    if (data.address_line_2 !== undefined && data.address_line_2 !== null) {
      if (typeof data.address_line_2 !== "string") {
        throw new BadRequestException("Address line 2 must be a string");
      }

      if (data.address_line_2.trim() === "") {
        throw new BadRequestException(
          "Address line 2 cannot be empty if provided",
        );
      }

      if (data.address_line_2.length > 200) {
        throw new BadRequestException(
          "Address line 2 must not exceed 200 characters",
        );
      }
    }

    // Validate is_primary (optional)
    if (data.is_primary !== undefined && typeof data.is_primary !== "boolean") {
      throw new BadRequestException("is_primary must be a boolean");
    }

    // Validate is_default (optional)
    if (data.is_default !== undefined && typeof data.is_default !== "boolean") {
      throw new BadRequestException("is_default must be a boolean");
    }

    this.logger.log("Address creation data validation passed");
  }

  async validateUpdate(data: any): Promise<void> {
    this.logger.log("Validating address update data");

    // Validate address_line_1 if provided
    if (data.address_line_1 !== undefined) {
      if (typeof data.address_line_1 !== "string") {
        throw new BadRequestException("Address line 1 must be a string");
      }

      if (!data.address_line_1.trim()) {
        throw new BadRequestException("Address line 1 cannot be empty");
      }

      if (data.address_line_1.length > 200) {
        throw new BadRequestException(
          "Address line 1 must not exceed 200 characters",
        );
      }
    }

    // Validate city if provided
    if (data.city !== undefined) {
      if (typeof data.city !== "string") {
        throw new BadRequestException("City must be a string");
      }

      if (!data.city.trim()) {
        throw new BadRequestException("City cannot be empty");
      }

      if (data.city.length > 100) {
        throw new BadRequestException("City must not exceed 100 characters");
      }
    }

    // Validate state if provided
    if (data.state !== undefined) {
      if (typeof data.state !== "string") {
        throw new BadRequestException("State must be a string");
      }

      if (!data.state.trim()) {
        throw new BadRequestException("State cannot be empty");
      }

      if (data.state.length > 50) {
        throw new BadRequestException("State must not exceed 50 characters");
      }
    }

    // Validate country if provided
    if (data.country !== undefined) {
      if (typeof data.country !== "string") {
        throw new BadRequestException("Country must be a string");
      }

      if (!data.country.trim()) {
        throw new BadRequestException("Country cannot be empty");
      }

      if (data.country.length > 100) {
        throw new BadRequestException("Country must not exceed 100 characters");
      }
    }

    // Validate zip_code if provided
    if (data.zip_code !== undefined) {
      if (typeof data.zip_code !== "string") {
        throw new BadRequestException("ZIP code must be a string");
      }

      if (!data.zip_code.trim()) {
        throw new BadRequestException("ZIP code cannot be empty");
      }

      if (data.zip_code.length > 20) {
        throw new BadRequestException("ZIP code must not exceed 20 characters");
      }
    }

    // Validate district if provided
    if (data.district !== undefined && data.district !== null) {
      if (typeof data.district !== "string") {
        throw new BadRequestException("District must be a string");
      }

      if (data.district.trim() === "") {
        throw new BadRequestException("District cannot be empty if provided");
      }

      if (data.district.length > 100) {
        throw new BadRequestException(
          "District must not exceed 100 characters",
        );
      }
    }

    // Validate address_line_2 if provided
    if (data.address_line_2 !== undefined && data.address_line_2 !== null) {
      if (typeof data.address_line_2 !== "string") {
        throw new BadRequestException("Address line 2 must be a string");
      }

      if (data.address_line_2.trim() === "") {
        throw new BadRequestException(
          "Address line 2 cannot be empty if provided",
        );
      }

      if (data.address_line_2.length > 200) {
        throw new BadRequestException(
          "Address line 2 must not exceed 200 characters",
        );
      }
    }

    // Validate is_primary if provided
    if (data.is_primary !== undefined && typeof data.is_primary !== "boolean") {
      throw new BadRequestException("is_primary must be a boolean");
    }

    // Validate is_default if provided
    if (data.is_default !== undefined && typeof data.is_default !== "boolean") {
      throw new BadRequestException("is_default must be a boolean");
    }

    this.logger.log("Address update data validation passed");
  }
}
