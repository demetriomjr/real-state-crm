// Validation utilities for frontend forms

// Email validation regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone number validation regex (supports various formats)
export const PHONE_REGEX = /^[+]?[1-9][\d]{0,15}$/;

// Human name validation regex (letters, spaces, hyphens, apostrophes, dots, and accented characters)
export const HUMAN_NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s\-'.]+$/;

// Username validation regex (letters and numbers only)
export const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;

// Domain validation regex (6-16 characters, letters and numbers only)
export const DOMAIN_REGEX = /^[a-zA-Z0-9]{6,16}$/;

// Contact types (matching backend contact.validator.ts)
export const CONTACT_TYPES = ["email", "phone", "cellphone"] as const;
export type ContactType = typeof CONTACT_TYPES[number];

// Document types
export const DOCUMENT_TYPES = ['cpf', 'cnpj', 'rg', 'passport', 'driver_license'] as const;
export type DocumentType = typeof DOCUMENT_TYPES[number];

// Validation functions
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters except + at the beginning
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // Check if it matches the phone regex
  if (!PHONE_REGEX.test(cleanPhone)) {
    return false;
  }
  
  // Brazilian landline phone validation (10-11 digits)
  // Format: (XX) XXXX-XXXX or (XX) XXXXX-XXXX
  if (cleanPhone.startsWith('+55')) {
    const digits = cleanPhone.substring(3);
    return digits.length >= 10 && digits.length <= 11;
  } else if (cleanPhone.startsWith('55') && cleanPhone.length >= 12) {
    const digits = cleanPhone.substring(2);
    return digits.length >= 10 && digits.length <= 11;
  } else if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
    // Local Brazilian format
    return true;
  }
  
  // International phone validation (7-15 digits)
  const digitsOnly = cleanPhone.replace(/[^\d]/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

export const validateCellphone = (cellphone: string): boolean => {
  // Remove all non-digit characters except + at the beginning
  const cleanCellphone = cellphone.replace(/[^\d+]/g, '');
  
  // Check if it matches the phone regex
  if (!PHONE_REGEX.test(cleanCellphone)) {
    return false;
  }
  
  // Brazilian cellphone validation (11 digits)
  // Format: (XX) 9XXXX-XXXX
  if (cleanCellphone.startsWith('+55')) {
    const digits = cleanCellphone.substring(3);
    return digits.length === 11 && digits.startsWith('9');
  } else if (cleanCellphone.startsWith('55') && cleanCellphone.length === 13) {
    const digits = cleanCellphone.substring(2);
    return digits.length === 11 && digits.startsWith('9');
  } else if (cleanCellphone.length === 11) {
    // Local Brazilian format - must start with 9
    return cleanCellphone.startsWith('9');
  }
  
  // International cellphone validation (7-15 digits)
  const digitsOnly = cleanCellphone.replace(/[^\d]/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

export const validateHumanName = (name: string): boolean => {
  const trimmedName = name.trim();
  
  // Check if name is empty
  if (trimmedName.length === 0) {
    return false;
  }
  
  // Check if name is too short (less than 2 characters)
  if (trimmedName.length < 2) {
    return false;
  }
  
  // Check if name is too long (more than 100 characters)
  if (trimmedName.length > 100) {
    return false;
  }
  
  // Check if name contains only valid characters
  if (!HUMAN_NAME_REGEX.test(trimmedName)) {
    return false;
  }
  
  // Check if name contains at least one letter
  if (!/[a-zA-ZÀ-ÿ\u00C0-\u017F]/.test(trimmedName)) {
    return false;
  }
  
  // Check for consecutive spaces, hyphens, or apostrophes
  if (/[\s\-']{2,}/.test(trimmedName)) {
    return false;
  }
  
  // Check if name starts or ends with invalid characters
  if (/^[\s\-'.]|[\s\-'.]$/.test(trimmedName)) {
    return false;
  }
  
  return true;
};

export const validateUsername = (username: string): boolean => {
  return USERNAME_REGEX.test(username) && username.length > 0;
};

export const validateDomain = (domain: string): boolean => {
  return DOMAIN_REGEX.test(domain);
};

export const validateContactType = (contactType: string): boolean => {
  return CONTACT_TYPES.includes(contactType as ContactType);
};

export const validateContactValue = (contactType: string, contactValue: string): boolean => {
  const trimmedValue = contactValue.trim();
  
  if (trimmedValue.length === 0 || trimmedValue.length > 100) {
    return false;
  }
  
  switch (contactType.toLowerCase()) {
    case 'email':
      return validateEmail(trimmedValue);
    case 'phone':
      return validatePhone(trimmedValue);
    case 'cellphone':
      return validateCellphone(trimmedValue);
    default:
      return false;
  }
};

// Brazilian document validation functions
export const validateCPF = (cpf: string): boolean => {
  // Remove all non-digit characters
  const cleanCPF = cpf.replace(/\D/g, '');
  
  // Check if CPF has 11 digits
  if (cleanCPF.length !== 11) {
    return false;
  }
  
  // Check for invalid patterns (all same digits)
  if (/^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }
  
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
};

export const validateCNPJ = (cnpj: string): boolean => {
  // Remove all non-digit characters
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  // Check if CNPJ has 14 digits
  if (cleanCNPJ.length !== 14) {
    return false;
  }
  
  // Check for invalid patterns (all same digits)
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }
  
  // Validate CNPJ algorithm
  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  if (firstDigit !== parseInt(cleanCNPJ.charAt(12))) return false;
  
  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  if (secondDigit !== parseInt(cleanCNPJ.charAt(13))) return false;
  
  return true;
};

export const validateDocumentType = (documentType: string): boolean => {
  return DOCUMENT_TYPES.includes(documentType as DocumentType);
};

export const validateDocumentNumber = (documentType: string, documentNumber: string): boolean => {
  const trimmedNumber = documentNumber.trim();
  
  if (trimmedNumber.length === 0) {
    return false;
  }
  
  switch (documentType.toLowerCase()) {
    case 'cpf':
      return validateCPF(trimmedNumber);
    case 'cnpj':
      return validateCNPJ(trimmedNumber);
    case 'rg': {
      // RG validation - basic length check (Brazilian RG is typically 7-9 digits)
      const cleanRG = trimmedNumber.replace(/\D/g, '');
      return /^\d{7,9}$/.test(cleanRG);
    }
    case 'passport':
      // Passport validation - alphanumeric, 6-12 characters
      return /^[A-Za-z0-9]{6,12}$/.test(trimmedNumber);
    case 'driver_license':
      // Driver's license validation - alphanumeric, 8-15 characters
      return /^[A-Za-z0-9]{8,15}$/.test(trimmedNumber);
    default:
      return false;
  }
};

// Phone number formatting utilities
export const formatPhone = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Brazilian landline phone formatting
  if (digits.length === 10) {
    // Format: (XX) XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits.startsWith('55')) {
    // International Brazilian format: +55 (XX) XXXX-XXXX
    const localDigits = digits.slice(2);
    if (localDigits.length === 10) {
      return `+55 (${localDigits.slice(0, 2)}) ${localDigits.slice(2, 6)}-${localDigits.slice(6)}`;
    }
  } else if (digits.length === 13 && digits.startsWith('55')) {
    // International Brazilian format with area code: +55 (XX) XXXXX-XXXX
    const localDigits = digits.slice(2);
    if (localDigits.length === 11) {
      return `+55 (${localDigits.slice(0, 2)}) ${localDigits.slice(2, 7)}-${localDigits.slice(7)}`;
    }
  }
  
  // International phone formatting
  if (digits.length >= 7 && digits.length <= 15) {
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 11) {
      return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
  }
  
  return phone; // Return original if no format matches
};

export const formatCellphone = (cellphone: string): string => {
  // Remove all non-digit characters
  const digits = cellphone.replace(/\D/g, '');
  
  // Brazilian cellphone formatting
  if (digits.length === 11 && digits.startsWith('9')) {
    // Format: (XX) 9XXXX-XXXX
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 13 && digits.startsWith('55')) {
    // International Brazilian format: +55 (XX) 9XXXX-XXXX
    const localDigits = digits.slice(2);
    if (localDigits.length === 11 && localDigits.startsWith('9')) {
      return `+55 (${localDigits.slice(0, 2)}) ${localDigits.slice(2, 7)}-${localDigits.slice(7)}`;
    }
  }
  
  // International cellphone formatting
  if (digits.length >= 7 && digits.length <= 15) {
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 11) {
      return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
  }
  
  return cellphone; // Return original if no format matches
};

// Legacy function for backward compatibility
export const formatPhoneNumber = formatPhone;

// Document formatting utilities
export const formatCPF = (cpf: string): string => {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  return cpf;
};

export const formatCNPJ = (cnpj: string): string => {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length === 14) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }
  return cnpj;
};

export const formatDocumentNumber = (documentType: string, documentNumber: string): string => {
  switch (documentType.toLowerCase()) {
    case 'cpf':
      return formatCPF(documentNumber);
    case 'cnpj':
      return formatCNPJ(documentNumber);
    case 'rg': {
      // RG formatting - add dots for readability
      const rgDigits = documentNumber.replace(/\D/g, '');
      if (rgDigits.length >= 7) {
        return `${rgDigits.slice(0, 2)}.${rgDigits.slice(2, 5)}.${rgDigits.slice(5)}`;
      }
      return documentNumber;
    }
    default:
      return documentNumber;
  }
};

// Sanitize input functions
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizePhone = (phone: string): string => {
  // Keep only digits and + at the beginning
  return phone.replace(/[^\d+]/g, '');
};

export const sanitizeHumanName = (name: string): string => {
  return name.trim().replace(/\s+/g, ' '); // Remove extra spaces
};

export const sanitizeUsername = (username: string): string => {
  return username.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
};

export const sanitizeDomain = (domain: string): string => {
  return domain.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
};

// Brazilian zip code (CEP) validation and formatting
export const validateCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8 && /^\d{8}$/.test(cleanCEP);
};

export const formatCEP = (cep: string): string => {
  const digits = cep.replace(/\D/g, '');
  if (digits.length === 8) {
    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }
  return cep;
};

// ViaCEP API integration for address lookup
export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const fetchAddressByCEP = async (cep: string): Promise<ViaCEPResponse | null> => {
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (!validateCEP(cleanCEP)) {
    return null;
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data: ViaCEPResponse = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching address from ViaCEP:', error);
    return null;
  }
};

// Validation error messages
export const getValidationErrorMessage = (field: string, value: string, t?: (key: string) => string): string => {
  if (!t) return ''; // Return empty if no translation function provided
  
  switch (field) {
    case 'email':
      return !validateEmail(value) ? t('validation.invalidEmail') : '';
    case 'phone':
      return !validatePhone(value) ? t('validation.invalidPhone') : '';
    case 'humanName':
      return !validateHumanName(value) ? t('validation.invalidName') : '';
    case 'username':
      return !validateUsername(value) ? t('validation.invalidUsername') : '';
    case 'domain':
      return !validateDomain(value) ? t('validation.invalidDomain') : '';
    case 'contactType':
      return !validateContactType(value) ? `Contact type must be one of: ${CONTACT_TYPES.join(', ')}` : '';
    default:
      return '';
  }
};

// Contact validation error messages
export const getContactValidationErrorMessage = (contactType: string, contactValue: string, t?: (key: string) => string): string => {
  if (!t) return ''; // Return empty if no translation function provided
  
  if (!validateContactType(contactType)) {
    return `Contact type must be one of: ${CONTACT_TYPES.join(', ')}`;
  }
  
  if (!validateContactValue(contactType, contactValue)) {
    switch (contactType.toLowerCase()) {
      case 'email':
        return t('contact.validation.invalidEmail');
      case 'phone':
      case 'whatsapp':
      case 'cellphone':
        return t('contact.validation.invalidPhone');
      default:
        return t('contact.validation.invalidContact');
    }
  }
  
  return '';
};

// Document validation error messages
export const getDocumentValidationErrorMessage = (documentType: string, documentNumber: string, t?: (key: string) => string): string => {
  if (!t) return ''; // Return empty if no translation function provided
  
  if (!validateDocumentType(documentType)) {
    return `Document type must be one of: ${DOCUMENT_TYPES.join(', ')}`;
  }
  
  if (!validateDocumentNumber(documentType, documentNumber)) {
    switch (documentType.toLowerCase()) {
      case 'cpf':
        return t('document.validation.invalidCPF');
      case 'cnpj':
        return t('document.validation.invalidCNPJ');
      case 'rg':
        return t('document.validation.invalidRG');
      case 'passport':
        return t('document.validation.invalidPassport');
      case 'driver_license':
        return t('document.validation.invalidDriverLicense');
      default:
        return t('document.validation.invalidDocument');
    }
  }
  
  return '';
};
