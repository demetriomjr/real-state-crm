import { Injectable, BadRequestException, Logger } from '@nestjs/common';

@Injectable()
export class LeadValidator {
  private readonly logger = new Logger(LeadValidator.name);

  // Expected lead types
  private readonly expectedLeadTypes = ['customer', 'prospect'];

  // Expected lead statuses
  private readonly expectedLeadStatuses = ['new', 'contacted', 'qualified', 'won', 'lost'];

  // Expected lead temperatures
  private readonly expectedLeadTemperatures = ['hot', 'warm', 'cold'];

  // Expected lead origins
  private readonly expectedLeadOrigins = ['website', 'email', 'phone', 'whatsapp', 'cellphone', 'other'];

  async validateCreate(data: any): Promise<void> {
    this.logger.log('Validating lead creation data');

    // Validate lead_type
    if (!data.lead_type || typeof data.lead_type !== 'string') {
      throw new BadRequestException('Lead type is required and must be a string');
    }

    if (!this.expectedLeadTypes.includes(data.lead_type.toLowerCase())) {
      throw new BadRequestException(`Lead type must be one of: ${this.expectedLeadTypes.join(', ')}`);
    }

    // Validate lead_status
    if (!data.lead_status || typeof data.lead_status !== 'string') {
      throw new BadRequestException('Lead status is required and must be a string');
    }

    if (!this.expectedLeadStatuses.includes(data.lead_status.toLowerCase())) {
      throw new BadRequestException(`Lead status must be one of: ${this.expectedLeadStatuses.join(', ')}`);
    }

    // Validate lead_temperature
    if (!data.lead_temperature || typeof data.lead_temperature !== 'string') {
      throw new BadRequestException('Lead temperature is required and must be a string');
    }

    if (!this.expectedLeadTemperatures.includes(data.lead_temperature.toLowerCase())) {
      throw new BadRequestException(`Lead temperature must be one of: ${this.expectedLeadTemperatures.join(', ')}`);
    }

    // Validate lead_origin
    if (!data.lead_origin || typeof data.lead_origin !== 'string') {
      throw new BadRequestException('Lead origin is required and must be a string');
    }

    if (!this.expectedLeadOrigins.includes(data.lead_origin.toLowerCase())) {
      throw new BadRequestException(`Lead origin must be one of: ${this.expectedLeadOrigins.join(', ')}`);
    }

    // Validate lead_description
    if (!data.lead_description || typeof data.lead_description !== 'string') {
      throw new BadRequestException('Lead description is required and must be a string');
    }

    if (!data.lead_description.trim()) {
      throw new BadRequestException('Lead description cannot be empty');
    }

    if (data.lead_description.length > 1000) {
      throw new BadRequestException('Lead description must not exceed 1000 characters');
    }

    // Validate lead_notes (optional)
    if (data.lead_notes !== undefined) {
      if (!Array.isArray(data.lead_notes)) {
        throw new BadRequestException('Lead notes must be an array');
      }

      for (let i = 0; i < data.lead_notes.length; i++) {
        const note = data.lead_notes[i];
        if (typeof note !== 'string') {
          throw new BadRequestException(`Lead note at index ${i} must be a string`);
        }

        if (!note.trim()) {
          throw new BadRequestException(`Lead note at index ${i} cannot be empty`);
        }

        if (note.length > 500) {
          throw new BadRequestException(`Lead note at index ${i} must not exceed 500 characters`);
        }
      }
    }

    // Validate first_contacted_by
    if (!data.first_contacted_by || typeof data.first_contacted_by !== 'string') {
      throw new BadRequestException('First contacted by is required and must be a string');
    }

    // Basic UUID validation for first_contacted_by
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.first_contacted_by)) {
      throw new BadRequestException('First contacted by must be a valid UUID');
    }

    this.logger.log('Lead creation data validation passed');
  }

  async validateUpdate(data: any): Promise<void> {
    this.logger.log('Validating lead update data');

    // Validate lead_type if provided
    if (data.lead_type !== undefined) {
      if (typeof data.lead_type !== 'string') {
        throw new BadRequestException('Lead type must be a string');
      }

      if (!this.expectedLeadTypes.includes(data.lead_type.toLowerCase())) {
        throw new BadRequestException(`Lead type must be one of: ${this.expectedLeadTypes.join(', ')}`);
      }
    }

    // Validate lead_status if provided
    if (data.lead_status !== undefined) {
      if (typeof data.lead_status !== 'string') {
        throw new BadRequestException('Lead status must be a string');
      }

      if (!this.expectedLeadStatuses.includes(data.lead_status.toLowerCase())) {
        throw new BadRequestException(`Lead status must be one of: ${this.expectedLeadStatuses.join(', ')}`);
      }
    }

    // Validate lead_temperature if provided
    if (data.lead_temperature !== undefined) {
      if (typeof data.lead_temperature !== 'string') {
        throw new BadRequestException('Lead temperature must be a string');
      }

      if (!this.expectedLeadTemperatures.includes(data.lead_temperature.toLowerCase())) {
        throw new BadRequestException(`Lead temperature must be one of: ${this.expectedLeadTemperatures.join(', ')}`);
      }
    }

    // Validate lead_origin if provided
    if (data.lead_origin !== undefined) {
      if (typeof data.lead_origin !== 'string') {
        throw new BadRequestException('Lead origin must be a string');
      }

      if (!this.expectedLeadOrigins.includes(data.lead_origin.toLowerCase())) {
        throw new BadRequestException(`Lead origin must be one of: ${this.expectedLeadOrigins.join(', ')}`);
      }
    }

    // Validate lead_description if provided
    if (data.lead_description !== undefined) {
      if (typeof data.lead_description !== 'string') {
        throw new BadRequestException('Lead description must be a string');
      }

      if (!data.lead_description.trim()) {
        throw new BadRequestException('Lead description cannot be empty');
      }

      if (data.lead_description.length > 1000) {
        throw new BadRequestException('Lead description must not exceed 1000 characters');
      }
    }

    // Validate lead_notes if provided
    if (data.lead_notes !== undefined) {
      if (!Array.isArray(data.lead_notes)) {
        throw new BadRequestException('Lead notes must be an array');
      }

      for (let i = 0; i < data.lead_notes.length; i++) {
        const note = data.lead_notes[i];
        if (typeof note !== 'string') {
          throw new BadRequestException(`Lead note at index ${i} must be a string`);
        }

        if (!note.trim()) {
          throw new BadRequestException(`Lead note at index ${i} cannot be empty`);
        }

        if (note.length > 500) {
          throw new BadRequestException(`Lead note at index ${i} must not exceed 500 characters`);
        }
      }
    }

    // Validate first_contacted_by if provided
    if (data.first_contacted_by !== undefined) {
      if (typeof data.first_contacted_by !== 'string') {
        throw new BadRequestException('First contacted by must be a string');
      }

      // Basic UUID validation for first_contacted_by
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(data.first_contacted_by)) {
        throw new BadRequestException('First contacted by must be a valid UUID');
      }
    }

    this.logger.log('Lead update data validation passed');
  }
}
