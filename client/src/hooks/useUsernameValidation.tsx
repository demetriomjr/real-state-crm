import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import usernameService from '../services/usernameService';

interface UsernameValidationState {
  isValidating: boolean;
  isAvailable: boolean | null;
  message: string;
  error: string | null;
}

export const useUsernameValidation = (debounceMs: number = 500) => {
  const [validationState, setValidationState] = useState<UsernameValidationState>({
    isValidating: false,
    isAvailable: null,
    message: '',
    error: null,
  });

  const validateUsername = useCallback(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setValidationState({
          isValidating: false,
          isAvailable: null,
          message: '',
          error: null,
        });
        return;
      }

      setValidationState(prev => ({ ...prev, isValidating: true, error: null }));

      try {
        const result = await usernameService.checkUsernameAvailability(username);
        setValidationState({
          isValidating: false,
          isAvailable: result.available,
          message: result.message || '',
          error: null,
        });
      } catch (error: any) {
        setValidationState({
          isValidating: false,
          isAvailable: null,
          message: '',
          error: 'Erro ao verificar disponibilidade do nome de usuário',
        });
      }
    }, debounceMs),
    [debounceMs]
  );

  const resetValidation = useCallback(() => {
    setValidationState({
      isValidating: false,
      isAvailable: null,
      message: '',
      error: null,
    });
  }, []);

  return {
    ...validationState,
    validateUsername,
    resetValidation,
  };
};
