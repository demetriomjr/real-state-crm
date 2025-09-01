import { Injectable, BadRequestException, Logger } from "@nestjs/common";

@Injectable()
export class ContactValidator {
  private readonly logger = new Logger(ContactValidator.name);

  // Expected contact types
  private readonly expectedContactTypes = [
    "email",
    "phone",
    "whatsapp",
    "cellphone",
  ];

  // Regex patterns for different contact types
  private readonly emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // International phone regex - supports various formats
  private readonly phoneRegex =
    /^(\+?[1-9]\d{1,14}|\(\d{1,4}\)\s*\d{1,14}|\d{1,14})$/;

  // WhatsApp regex - similar to phone but can include spaces and dashes
  private readonly whatsappRegex =
    /^(\+?[1-9]\d{1,14}|\(\d{1,4}\)\s*\d{1,14}|\d{1,14})$/;

  // Cellphone regex - Brazilian format and international
  private readonly cellphoneRegex =
    /^(\+?[1-9]\d{1,14}|\(\d{1,4}\)\s*\d{1,14}|\d{1,14})$/;

  async validateCreate(data: any): Promise<void> {
    this.logger.log("Validating contact creation data");

    // Validate contact_type
    if (!data.contact_type || typeof data.contact_type !== "string") {
      throw new BadRequestException(
        "Contact type is required and must be a string",
      );
    }

    if (!this.expectedContactTypes.includes(data.contact_type.toLowerCase())) {
      throw new BadRequestException(
        `Contact type must be one of: ${this.expectedContactTypes.join(", ")}`,
      );
    }

    // Validate contact_value
    if (!data.contact_value || typeof data.contact_value !== "string") {
      throw new BadRequestException(
        "Contact value is required and must be a string",
      );
    }

    if (!data.contact_value.trim()) {
      throw new BadRequestException("Contact value cannot be empty");
    }

    if (data.contact_value.length > 100) {
      throw new BadRequestException(
        "Contact value must not exceed 100 characters",
      );
    }

    // Validate contact value format based on type
    await this.validateContactValueFormat(
      data.contact_type,
      data.contact_value,
    );

    // Validate is_primary (optional)
    if (data.is_primary !== undefined && typeof data.is_primary !== "boolean") {
      throw new BadRequestException("is_primary must be a boolean");
    }

    this.logger.log("Contact creation data validation passed");
  }

  async validateUpdate(data: any): Promise<void> {
    this.logger.log("Validating contact update data");

    // Validate contact_type if provided
    if (data.contact_type !== undefined) {
      if (typeof data.contact_type !== "string") {
        throw new BadRequestException("Contact type must be a string");
      }

      if (
        !this.expectedContactTypes.includes(data.contact_type.toLowerCase())
      ) {
        throw new BadRequestException(
          `Contact type must be one of: ${this.expectedContactTypes.join(", ")}`,
        );
      }
    }

    // Validate contact_value if provided
    if (data.contact_value !== undefined) {
      if (typeof data.contact_value !== "string") {
        throw new BadRequestException("Contact value must be a string");
      }

      if (!data.contact_value.trim()) {
        throw new BadRequestException("Contact value cannot be empty");
      }

      if (data.contact_value.length > 100) {
        throw new BadRequestException(
          "Contact value must not exceed 100 characters",
        );
      }

      // Validate contact value format if both type and value are provided
      if (data.contact_type) {
        await this.validateContactValueFormat(
          data.contact_type,
          data.contact_value,
        );
      }
    }

    // Validate is_primary if provided
    if (data.is_primary !== undefined && typeof data.is_primary !== "boolean") {
      throw new BadRequestException("is_primary must be a boolean");
    }

    this.logger.log("Contact update data validation passed");
  }

  private async validateContactValueFormat(
    contactType: string,
    contactValue: string,
  ): Promise<void> {
    const type = contactType.toLowerCase();
    const cleanValue = contactValue.trim();

    switch (type) {
      case "email":
        if (!this.emailRegex.test(cleanValue)) {
          throw new BadRequestException("Invalid email format");
        }
        break;
      case "phone":
        if (!this.isValidPhone(cleanValue)) {
          throw new BadRequestException("Invalid phone format");
        }
        break;
      case "whatsapp":
        if (!this.isValidWhatsApp(cleanValue)) {
          throw new BadRequestException("Invalid WhatsApp format");
        }
        break;
      case "cellphone":
        if (!this.isValidCellphone(cleanValue)) {
          throw new BadRequestException("Invalid cellphone format");
        }
        break;
      default:
        throw new BadRequestException(`Unknown contact type: ${contactType}`);
    }
  }

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

  private isValidWhatsApp(value: string): boolean {
    // Remove common separators
    const cleanValue = value.replace(/[\s\-\(\)\.]/g, "");

    // Check if it matches the WhatsApp regex
    if (!this.whatsappRegex.test(cleanValue)) {
      return false;
    }

    // WhatsApp numbers should be valid phone numbers
    return this.isValidPhone(value);
  }

  private isValidCellphone(value: string): boolean {
    // Remove common separators
    const cleanValue = value.replace(/[\s\-\(\)\.]/g, "");

    // Check if it matches the cellphone regex
    if (!this.cellphoneRegex.test(cleanValue)) {
      return false;
    }

    // Brazilian cellphone validation
    if (cleanValue.startsWith("55")) {
      // Brazilian cellphone should be 13 digits (55 + 2 digits DDD + 9 digits)
      return cleanValue.length === 13;
    }

    // International cellphone numbers should be between 7 and 15 digits
    return cleanValue.length >= 7 && cleanValue.length <= 15;
  }

  // Helper method to format phone numbers for display
  formatPhoneNumber(value: string, countryCode: string = "BR"): string {
    const cleanValue = value.replace(/\D/g, "");

    if (countryCode === "BR") {
      // Brazilian format: (11) 99999-9999
      if (cleanValue.length === 11) {
        return `(${cleanValue.substring(0, 2)}) ${cleanValue.substring(2, 7)}-${cleanValue.substring(7)}`;
      }
      // Brazilian format with country code: +55 (11) 99999-9999
      if (cleanValue.length === 13 && cleanValue.startsWith("55")) {
        return `+55 (${cleanValue.substring(2, 4)}) ${cleanValue.substring(4, 9)}-${cleanValue.substring(9)}`;
      }
    }

    // Default international format
    return cleanValue;
  }

  // Helper method to validate Brazilian phone numbers specifically
  isValidBrazilianPhone(value: string): boolean {
    const cleanValue = value.replace(/\D/g, "");

    // Brazilian phone numbers: 10 digits (DDD + number) or 11 digits (DDD + number)
    if (cleanValue.length === 10 || cleanValue.length === 11) {
      return true;
    }

    // Brazilian phone numbers with country code: 12 digits (55 + DDD + number) or 13 digits (55 + DDD + number)
    if (cleanValue.length === 12 || cleanValue.length === 13) {
      return cleanValue.startsWith("55");
    }

    return false;
  }
}
