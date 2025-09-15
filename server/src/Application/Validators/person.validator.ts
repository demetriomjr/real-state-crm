import { Injectable } from "@nestjs/common";

@Injectable()
export class PersonValidator {
  validateCreate(personData: any): void {
    // Basic validation for person creation
    if (!personData.full_name || personData.full_name.trim() === "") {
      throw new Error("Full name is required for person creation");
    }

    if (!personData.tenant_id || personData.tenant_id.trim() === "") {
      throw new Error("Tenant ID is required for person creation");
    }
  }

  validateUpdate(personData: any): void {
    // Basic validation for person updates
    if (personData.full_name !== undefined && personData.full_name.trim() === "") {
      throw new Error("Full name cannot be empty");
    }
  }
}