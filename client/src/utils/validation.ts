// Validation utilities for frontend forms

// Email validation regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone number validation regex (supports various formats)
export const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

// Human name validation regex (letters, spaces, hyphens, apostrophes, dots, and accented characters)
export const HUMAN_NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s\-'\.]+$/;

// Username validation regex (letters and numbers only)
export const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;

// Domain validation regex (6-16 characters, letters and numbers only)
export const DOMAIN_REGEX = /^[a-zA-Z0-9]{6,16}$/;

// Contact types (matching backend contact.validator.ts)
export const CONTACT_TYPES = ["email", "phone", "whatsapp", "cellphone"] as const;
export type ContactType = typeof CONTACT_TYPES[number];

// Validation functions
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters except + at the beginning
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  return PHONE_REGEX.test(cleanPhone);
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
  if (/^[\s\-'\.]|[\s\-'\.]$/.test(trimmedName)) {
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
    case 'whatsapp':
    case 'cellphone':
      return validatePhone(trimmedValue);
    default:
      return false;
  }
};

// Phone number formatting utilities
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  } else if (digits.length === 11) {
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  return phone; // Return original if no format matches
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

// Validation error messages
export const getValidationErrorMessage = (field: string, value: string): string => {
  switch (field) {
    case 'email':
      return !validateEmail(value) ? 'Please enter a valid email address' : '';
    case 'phone':
      return !validatePhone(value) ? 'Please enter a valid phone number' : '';
    case 'humanName':
      return !validateHumanName(value) ? 'Please enter a valid name (2-100 characters, letters, spaces, hyphens, apostrophes, and dots only)' : '';
    case 'username':
      return !validateUsername(value) ? 'Username must contain only letters and numbers' : '';
    case 'domain':
      return !validateDomain(value) ? 'Domain must be 6-16 characters, letters and numbers only' : '';
    case 'contactType':
      return !validateContactType(value) ? `Contact type must be one of: ${CONTACT_TYPES.join(', ')}` : '';
    default:
      return '';
  }
};

// Contact validation error messages
export const getContactValidationErrorMessage = (contactType: string, contactValue: string): string => {
  if (!validateContactType(contactType)) {
    return `Contact type must be one of: ${CONTACT_TYPES.join(', ')}`;
  }
  
  if (!validateContactValue(contactType, contactValue)) {
    switch (contactType.toLowerCase()) {
      case 'email':
        return 'Please enter a valid email address';
      case 'phone':
      case 'whatsapp':
      case 'cellphone':
        return 'Please enter a valid phone number';
      default:
        return 'Please enter a valid contact value';
    }
  }
  
  return '';
};
