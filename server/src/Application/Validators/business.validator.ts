import { Injectable, BadRequestException, Logger } from "@nestjs/common";

@Injectable()
export class BusinessValidator {
  private readonly logger = new Logger(BusinessValidator.name);

  // Email validation regex
  private readonly emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Phone validation regex - international format
  private readonly phoneRegex =
    /^(\+?[1-9]\d{1,14}|\(\d{1,4}\)\s*\d{1,14}|\d{1,14})$/;

  async validateCreate(data: any): Promise<void> {
    this.logger.log("Validating business creation data");

    // Validate company_name
    if (!data.company_name || typeof data.company_name !== "string") {
      throw new BadRequestException(
        "Company name is required and must be a string",
      );
    }

    if (!data.company_name.trim()) {
      throw new BadRequestException("Company name cannot be empty");
    }

    if (data.company_name.length > 100) {
      throw new BadRequestException(
        "Company name must not exceed 100 characters",
      );
    }

    // Validate subscription
    if (data.subscription !== undefined) {
      if (
        typeof data.subscription !== "number" ||
        !Number.isInteger(data.subscription)
      ) {
        throw new BadRequestException("Subscription must be an integer");
      }

      if (data.subscription < 0 || data.subscription > 10) {
        throw new BadRequestException("Subscription must be between 0 and 10");
      }
    }

    // Validate master user information
    if (
      !data.master_user_fullName ||
      typeof data.master_user_fullName !== "string"
    ) {
      throw new BadRequestException(
        "Master user full name is required and must be a string",
      );
    }

    if (!data.master_user_fullName.trim()) {
      throw new BadRequestException("Master user full name cannot be empty");
    }

    if (
      !data.master_user_username ||
      typeof data.master_user_username !== "string"
    ) {
      throw new BadRequestException(
        "Master user username is required and must be a string",
      );
    }

    if (!data.master_user_username.trim()) {
      throw new BadRequestException("Master user username cannot be empty");
    }

    // Validate username format (letters and numbers only, no spaces)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(data.master_user_username)) {
      throw new BadRequestException(
        "Master user username must contain only letters and numbers, no spaces",
      );
    }

    if (
      !data.master_user_password ||
      typeof data.master_user_password !== "string"
    ) {
      throw new BadRequestException(
        "Master user password is required and must be a string",
      );
    }

    if (data.master_user_password.length < 6) {
      throw new BadRequestException(
        "Master user password must be at least 6 characters long",
      );
    }

    // Validate master user email (optional)
    if (
      data.master_user_email !== undefined &&
      data.master_user_email !== null &&
      data.master_user_email !== ""
    ) {
      if (typeof data.master_user_email !== "string") {
        throw new BadRequestException("Master user email must be a string");
      }

      if (!data.master_user_email.trim()) {
        throw new BadRequestException("Master user email cannot be empty");
      }

      if (!this.emailRegex.test(data.master_user_email)) {
        throw new BadRequestException("Invalid email format");
      }
    }

    // Validate master user phone (optional)
    if (
      data.master_user_phone !== undefined &&
      data.master_user_phone !== null &&
      data.master_user_phone !== ""
    ) {
      if (typeof data.master_user_phone !== "string") {
        throw new BadRequestException("Master user phone must be a string");
      }

      if (!data.master_user_phone.trim()) {
        throw new BadRequestException("Master user phone cannot be empty");
      }

      if (!this.isValidPhone(data.master_user_phone)) {
        throw new BadRequestException("Invalid phone format");
      }
    }

    this.logger.log("Business creation data validation passed");
  }

  async validateUpdate(data: any): Promise<void> {
    this.logger.log("Validating business update data");

    // Validate company_name if provided
    if (data.company_name !== undefined) {
      if (typeof data.company_name !== "string") {
        throw new BadRequestException("Company name must be a string");
      }

      if (!data.company_name.trim()) {
        throw new BadRequestException("Company name cannot be empty");
      }

      if (data.company_name.length > 100) {
        throw new BadRequestException(
          "Company name must not exceed 100 characters",
        );
      }
    }

    // Validate subscription if provided
    if (data.subscription !== undefined) {
      if (
        typeof data.subscription !== "number" ||
        !Number.isInteger(data.subscription)
      ) {
        throw new BadRequestException("Subscription must be an integer");
      }

      if (data.subscription < 0 || data.subscription > 10) {
        throw new BadRequestException("Subscription must be between 0 and 10");
      }
    }

    this.logger.log("Business update data validation passed");
  }

  // Helper method to validate username format
  isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
  }

  // Helper method to validate phone format
  private isValidPhone(value: string): boolean {
    // Remove common separators
    const cleanValue = value.replace(/[\s\-\(\)\.]/g, "");

    // Check if it matches the phone regex
    if (!this.phoneRegex.test(cleanValue)) {
      return false;
    }

    // Additional validation for Brazilian phone numbers
    if (cleanValue.startsWith("55")) {
      // Brazilian phone number should be 13 digits (55 + 2 digits DDD + 8-9 digits)
      return cleanValue.length >= 13 && cleanValue.length <= 14;
    }

    // International phone numbers should be between 7 and 15 digits
    return cleanValue.length >= 7 && cleanValue.length <= 15;
  }
}
