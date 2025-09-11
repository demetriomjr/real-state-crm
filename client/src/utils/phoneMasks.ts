// Phone number masks for different countries

export interface PhoneMask {
  country: string;
  countryCode: string;
  mask: string;
  placeholder: string;
  regex: RegExp;
  format: (value: string) => string;
  parse: (value: string) => string;
}

// Brazilian phone mask - supports both 8 digits (landline) and 9 digits (mobile)
export const BR_PHONE_MASK: PhoneMask = {
  country: 'Brazil',
  countryCode: '+55',
  mask: '(##) #####-####',
  placeholder: '(11) 1111-1111',
  regex: /^\(\d{2}\) \d{4,5}-\d{4}$/,
  format: (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) {
      return `(${digits}`;
    } else if (digits.length <= 3) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length <= 11) {
      // For 8 digits: (11) 3333-3333
      // For 9 digits: (11) 99999-9999
      return `(${digits.slice(0, 2)}) ${digits.slice(2, -4)}-${digits.slice(-4)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, -4)}-${digits.slice(-4)}`;
    }
  },
  parse: (value: string) => {
    return value.replace(/\D/g, '');
  },
};

// US phone mask
export const US_PHONE_MASK: PhoneMask = {
  country: 'United States',
  countryCode: '+1',
  mask: '(###) ###-####',
  placeholder: '(555) 123-4567',
  regex: /^\(\d{3}\) \d{3}-\d{4}$/,
  format: (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) {
      return `(${digits}`;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  },
  parse: (value: string) => {
    return value.replace(/\D/g, '');
  },
};

// Generic international phone mask
export const INTERNATIONAL_PHONE_MASK: PhoneMask = {
  country: 'International',
  countryCode: '+',
  mask: '+## ### ### ####',
  placeholder: '+1 555 123 4567',
  regex: /^\+\d{1,3} \d{3} \d{3} \d{4}$/,
  format: (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 1) {
      return `+${digits}`;
    } else if (digits.length <= 4) {
      return `+${digits.slice(0, 1)} ${digits.slice(1)}`;
    } else if (digits.length <= 7) {
      return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4)}`;
    } else {
      return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
    }
  },
  parse: (value: string) => {
    return value.replace(/\D/g, '');
  },
};

// Available phone masks
export const PHONE_MASKS: Record<string, PhoneMask> = {
  BR: BR_PHONE_MASK,
  US: US_PHONE_MASK,
  INTERNATIONAL: INTERNATIONAL_PHONE_MASK,
};

// Get phone mask by country code
export const getPhoneMask = (countryCode: string): PhoneMask => {
  return PHONE_MASKS[countryCode] || INTERNATIONAL_PHONE_MASK;
};

// Get all available phone masks
export const getAllPhoneMasks = (): PhoneMask[] => {
  return Object.values(PHONE_MASKS);
};

// Validate phone number with mask
export const validatePhoneWithMask = (value: string, mask: PhoneMask): boolean => {
  return mask.regex.test(value);
};

// Format phone number with mask
export const formatPhoneWithMask = (value: string, mask: PhoneMask): string => {
  return mask.format(value);
};

// Parse phone number from masked format
export const parsePhoneWithMask = (value: string, mask: PhoneMask): string => {
  return mask.parse(value);
};

// Auto-detect country from phone number
export const detectCountryFromPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('55')) {
    return 'BR';
  } else if (digits.startsWith('1')) {
    return 'US';
  }
  
  return 'INTERNATIONAL';
};

// Get phone mask suggestions based on input
export const getPhoneMaskSuggestions = (input: string): PhoneMask[] => {
  const suggestions: PhoneMask[] = [];
  const digits = input.replace(/\D/g, '');
  
  if (digits.startsWith('55')) {
    suggestions.push(BR_PHONE_MASK);
  } else if (digits.startsWith('1')) {
    suggestions.push(US_PHONE_MASK);
  }
  
  // Always include international as fallback
  if (!suggestions.includes(INTERNATIONAL_PHONE_MASK)) {
    suggestions.push(INTERNATIONAL_PHONE_MASK);
  }
  
  return suggestions;
};
