import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID } from 'class-validator';

@Injectable()
export class PersonValidator {
  private readonly logger = new Logger(PersonValidator.name);

  // Expected document types based on common Brazilian documents
  private readonly expectedDocumentTypes = [
    'cpf',
    'cnpj', 
    'rg',
    'passport',
    'driver_license',
    'voter_id',
    'work_card',
    'other'
  ];

  async validateCreate(data: any): Promise<void> {
    this.logger.log('Validating person creation data');
    
    // Validate full_name
    if (!data.full_name || typeof data.full_name !== 'string') {
      throw new BadRequestException('Full name is required and must be a string');
    }
    
    if (data.full_name.length < 2) {
      throw new BadRequestException('Full name must be at least 2 characters long');
    }
    
    if (data.full_name.length > 100) {
      throw new BadRequestException('Full name must not exceed 100 characters');
    }

    // Validate document_type
    if (!data.document_type || typeof data.document_type !== 'string') {
      throw new BadRequestException('Document type is required and must be a string');
    }

    if (!this.expectedDocumentTypes.includes(data.document_type.toLowerCase())) {
      throw new BadRequestException(`Document type must be one of: ${this.expectedDocumentTypes.join(', ')}`);
    }

    // Validate document_number
    if (!data.document_number || typeof data.document_number !== 'string') {
      throw new BadRequestException('Document number is required and must be a string');
    }

    if (data.document_number.length < 3) {
      throw new BadRequestException('Document number must be at least 3 characters long');
    }

    if (data.document_number.length > 20) {
      throw new BadRequestException('Document number must not exceed 20 characters');
    }

    // Validate document number format based on type
    await this.validateDocumentNumberFormat(data.document_type, data.document_number);

    // Validate tenant_id
    if (!data.tenant_id || typeof data.tenant_id !== 'string') {
      throw new BadRequestException('Tenant ID is required and must be a string');
    }

    if (!IsUUID(data.tenant_id)) {
      throw new BadRequestException('Tenant ID must be a valid UUID');
    }

    this.logger.log('Person creation data validation passed');
  }

  async validateUpdate(data: any): Promise<void> {
    this.logger.log('Validating person update data');

    // Validate full_name if provided
    if (data.full_name !== undefined) {
      if (typeof data.full_name !== 'string') {
        throw new BadRequestException('Full name must be a string');
      }
      
      if (data.full_name.length < 2) {
        throw new BadRequestException('Full name must be at least 2 characters long');
      }
      
      if (data.full_name.length > 100) {
        throw new BadRequestException('Full name must not exceed 100 characters');
      }
    }

    // Validate document_type if provided
    if (data.document_type !== undefined) {
      if (typeof data.document_type !== 'string') {
        throw new BadRequestException('Document type must be a string');
      }

      if (!this.expectedDocumentTypes.includes(data.document_type.toLowerCase())) {
        throw new BadRequestException(`Document type must be one of: ${this.expectedDocumentTypes.join(', ')}`);
      }
    }

    // Validate document_number if provided
    if (data.document_number !== undefined) {
      if (typeof data.document_number !== 'string') {
        throw new BadRequestException('Document number must be a string');
      }

      if (data.document_number.length < 3) {
        throw new BadRequestException('Document number must be at least 3 characters long');
      }

      if (data.document_number.length > 20) {
        throw new BadRequestException('Document number must not exceed 20 characters');
      }

      // Validate document number format if both type and number are provided
      if (data.document_type) {
        await this.validateDocumentNumberFormat(data.document_type, data.document_number);
      }
    }

    this.logger.log('Person update data validation passed');
  }

  private async validateDocumentNumberFormat(documentType: string, documentNumber: string): Promise<void> {
    const type = documentType.toLowerCase();
    
    switch (type) {
      case 'cpf':
        if (!this.isValidCPF(documentNumber)) {
          throw new BadRequestException('Invalid CPF format');
        }
        break;
      case 'cnpj':
        if (!this.isValidCNPJ(documentNumber)) {
          throw new BadRequestException('Invalid CNPJ format');
        }
        break;
      case 'rg':
        if (!this.isValidRG(documentNumber)) {
          throw new BadRequestException('Invalid RG format');
        }
        break;
      case 'passport':
        if (!this.isValidPassport(documentNumber)) {
          throw new BadRequestException('Invalid passport format');
        }
        break;
      case 'driver_license':
        if (!this.isValidDriverLicense(documentNumber)) {
          throw new BadRequestException('Invalid driver license format');
        }
        break;
      case 'voter_id':
        if (!this.isValidVoterId(documentNumber)) {
          throw new BadRequestException('Invalid voter ID format');
        }
        break;
      case 'work_card':
        if (!this.isValidWorkCard(documentNumber)) {
          throw new BadRequestException('Invalid work card format');
        }
        break;
      case 'other':
        // For 'other' type, just ensure it's not empty
        if (!documentNumber.trim()) {
          throw new BadRequestException('Document number cannot be empty');
        }
        break;
      default:
        throw new BadRequestException(`Unknown document type: ${documentType}`);
    }
  }

  private isValidCPF(cpf: string): boolean {
    // Remove non-digits
    const cleanCPF = cpf.replace(/\D/g, '');
    
    // Check if it has 11 digits
    if (cleanCPF.length !== 11) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Validate CPF algorithm
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCPF.charAt(10))) return false;
    
    return true;
  }

  private isValidCNPJ(cnpj: string): boolean {
    // Remove non-digits
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    // Check if it has 14 digits
    if (cleanCNPJ.length !== 14) return false;
    
    // Check if all digits are the same
    if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
    
    // Validate CNPJ algorithm
    let sum = 0;
    let weight = 2;
    
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    
    let remainder = sum % 11;
    let digit1 = remainder < 2 ? 0 : 11 - remainder;
    
    if (parseInt(cleanCNPJ.charAt(12)) !== digit1) return false;
    
    sum = 0;
    weight = 2;
    
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    
    remainder = sum % 11;
    let digit2 = remainder < 2 ? 0 : 11 - remainder;
    
    return parseInt(cleanCNPJ.charAt(13)) === digit2;
  }

  private isValidRG(rg: string): boolean {
    // RG format can vary by state, so we'll use a basic validation
    // Remove non-alphanumeric characters
    const cleanRG = rg.replace(/[^a-zA-Z0-9]/g, '');
    
    // RG should be between 8 and 12 characters
    return cleanRG.length >= 8 && cleanRG.length <= 12;
  }

  private isValidPassport(passport: string): boolean {
    // Passport format can vary by country, so we'll use a basic validation
    // Remove spaces and check if it's alphanumeric
    const cleanPassport = passport.replace(/\s/g, '');
    
    // Passport should be between 6 and 12 characters
    return cleanPassport.length >= 6 && cleanPassport.length <= 12 && /^[a-zA-Z0-9]+$/.test(cleanPassport);
  }

  private isValidDriverLicense(driverLicense: string): boolean {
    // Brazilian driver license format
    const cleanLicense = driverLicense.replace(/\D/g, '');
    
    // Should be 11 digits
    return cleanLicense.length === 11;
  }

  private isValidVoterId(voterId: string): boolean {
    // Brazilian voter ID format
    const cleanVoterId = voterId.replace(/\D/g, '');
    
    // Should be 12 digits
    return cleanVoterId.length === 12;
  }

  private isValidWorkCard(workCard: string): boolean {
    // Brazilian work card format
    const cleanWorkCard = workCard.replace(/\D/g, '');
    
    // Should be 11 digits
    return cleanWorkCard.length === 11;
  }
}
