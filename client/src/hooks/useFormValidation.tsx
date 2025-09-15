import { useState, useCallback } from 'react';
import {
  sanitizeEmail,
  sanitizePhone,
  sanitizeHumanName,
  sanitizeUsername,
  sanitizeDomain,
} from '../utils/validation';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message?: string;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: string, value: string): string => {
    const rule = rules[name];
    if (!rule) return '';

    // Check required
    if (rule.required && (!value || value.trim() === '')) {
      return 'This field is required';
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') {
      return '';
    }

    // Check min length
    if (rule.minLength && value.length < rule.minLength) {
      return `Must be at least ${rule.minLength} characters`;
    }

    // Check max length
    if (rule.maxLength && value.length > rule.maxLength) {
      return `Must be no more than ${rule.maxLength} characters`;
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || 'Invalid format';
    }

    // Check custom validation
    if (rule.custom && !rule.custom(value)) {
      return rule.message || 'Invalid value';
    }

    return '';
  }, [rules]);

  const validateForm = useCallback((formData: { [key: string]: string }): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName] || '');
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const validateSingleField = useCallback((name: string, value: string): boolean => {
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    return !error;
  }, [validateField]);

  const clearError = useCallback((name: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((name: string): string => {
    return errors[name] || '';
  }, [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    validateForm,
    validateSingleField,
    clearError,
    clearAllErrors,
    getFieldError,
    hasErrors,
  };
};

// Predefined validation rules for common fields
export const commonValidationRules: ValidationRules = {
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    required: true,
    pattern: /^[+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number',
  },
  humanName: {
    required: true,
    pattern: /^[a-zA-ZÀ-ÿ\s\-']+$/,
    minLength: 2,
    message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)',
  },
  username: {
    required: true,
    pattern: /^[a-zA-Z0-9]+$/,
    minLength: 3,
    message: 'Username must contain only letters and numbers',
  },
  domain: {
    required: true,
    pattern: /^[a-zA-Z0-9]{6,16}$/,
    message: 'Domain must be 6-16 characters, letters and numbers only',
  },
  companyName: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: 'Company name must be between 2 and 100 characters',
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Password must be at least 6 characters',
  },
};

// Sanitization functions for form inputs
export const sanitizeFormData = (formData: { [key: string]: string }): { [key: string]: string } => {
  const sanitized: { [key: string]: string } = {};
  
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    switch (key) {
      case 'email':
        sanitized[key] = sanitizeEmail(value);
        break;
      case 'phone':
        sanitized[key] = sanitizePhone(value);
        break;
      case 'humanName':
      case 'fullName':
      case 'companyName':
        sanitized[key] = sanitizeHumanName(value);
        break;
      case 'username':
        sanitized[key] = sanitizeUsername(value);
        break;
      case 'domain':
        sanitized[key] = sanitizeDomain(value);
        break;
      default:
        sanitized[key] = value.trim();
    }
  });
  
  return sanitized;
};
