/**
 * Error handling utility to sanitize error messages and provide user-friendly feedback
 * This prevents sensitive technical details from being exposed to users
 */

export interface SanitizedError {
  message: string;
  shouldRedirectToLogin: boolean;
  isUserFriendly: boolean;
}

/**
 * Sanitizes error messages to hide sensitive technical details
 * @param error - The original error object
 * @param userLevel - User's permission level (for developer-specific errors)
 * @returns Sanitized error information
 */
export function sanitizeError(error: unknown, userLevel: number = 1): SanitizedError {
  // Default user-friendly error
  const defaultError: SanitizedError = {
    message: 'Ocorreu um erro inesperado. Tente novamente.',
    shouldRedirectToLogin: false,
    isUserFriendly: true,
  };

  // If no error provided
  if (!error) {
    return defaultError;
  }

  const errorObj = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
  const status = errorObj.response?.status;
  const message = errorObj.response?.data?.message || errorObj.message || '';

  // Handle authentication/authorization errors
  if (status === 401 || status === 403) {
    return {
      message: 'Sua sessão expirou. Por favor, faça login novamente.',
      shouldRedirectToLogin: true,
      isUserFriendly: true,
    };
  }

  // Handle network errors
  if (status === 0 || !status) {
    return {
      message: 'Erro de conexão. Verifique sua internet e tente novamente.',
      shouldRedirectToLogin: false,
      isUserFriendly: true,
    };
  }

  // Handle server errors
  if (status >= 500) {
    return {
      message: 'Erro interno do servidor. Tente novamente em alguns minutos.',
      shouldRedirectToLogin: false,
      isUserFriendly: true,
    };
  }

  // Handle specific error messages that should be hidden
  const sensitivePatterns = [
    /userSecret/i,
    /jwt/i,
    /token/i,
    /tenant_id/i,
    /user_level/i,
    /unauthorized/i,
    /forbidden/i,
    /invalid.*secret/i,
    /missing.*tenant/i,
    /missing.*user.*level/i,
    /authentication.*failed/i,
    /authorization.*failed/i,
  ];

  const isSensitive = sensitivePatterns.some(pattern => pattern.test(message));

  if (isSensitive) {
    // For level 10 users (developers), show more details in console but still sanitize user message
    if (userLevel === 10) {
      console.warn('Sensitive error detected (developer view):', {
        originalMessage: message,
        status,
        error: errorObj.response?.data,
      });
    }
    
    return {
      message: 'Sua sessão expirou. Por favor, faça login novamente.',
      shouldRedirectToLogin: true,
      isUserFriendly: true,
    };
  }

  // Handle validation errors (these are usually safe to show)
  if (status === 400) {
    // Check if it's a validation error (usually safe to show)
    const validationPatterns = [
      /required/i,
      /invalid/i,
      /must be/i,
      /should be/i,
      /cannot be/i,
      /too short/i,
      /too long/i,
      /format/i,
    ];

    const isValidationError = validationPatterns.some(pattern => pattern.test(message));
    
    if (isValidationError) {
      return {
        message: message, // Validation errors are usually safe to show
        shouldRedirectToLogin: false,
        isUserFriendly: true,
      };
    }

    // Other 400 errors should be sanitized
    return {
      message: 'Dados inválidos. Verifique as informações e tente novamente.',
      shouldRedirectToLogin: false,
      isUserFriendly: true,
    };
  }

  // For level 10 users, show more details in console for debugging
  if (userLevel === 10) {
    console.warn('Error details (developer view):', {
      message,
      status,
      error: errorObj.response?.data,
    });
  }

  // If we reach here, it's likely a safe error message
  return {
    message: message || defaultError.message,
    shouldRedirectToLogin: false,
    isUserFriendly: true,
  };
}

/**
 * Handles errors with automatic redirection and user feedback
 * @param error - The error to handle
 * @param userLevel - User's permission level
 * @param onRedirectToLogin - Callback to handle login redirection
 * @param showToast - Function to show toast messages
 * @returns The sanitized error message
 */
export function handleError(
  error: unknown,
  userLevel: number = 1,
  onRedirectToLogin?: () => void,
  showToast?: (message: string, type: 'error' | 'warning') => void
): string {
  const sanitized = sanitizeError(error, userLevel);

  // Show user-friendly message
  if (showToast) {
    showToast(sanitized.message, sanitized.shouldRedirectToLogin ? 'warning' : 'error');
  }

  // Handle redirection
  if (sanitized.shouldRedirectToLogin && onRedirectToLogin) {
    // Small delay to allow user to see the message
    setTimeout(() => {
      onRedirectToLogin();
    }, 1500);
  }

  return sanitized.message;
}
