import apiService from './api';

export interface UsernameCheckResponse {
  available: boolean;
  message?: string;
}

class UsernameService {
  async checkUsernameAvailability(username: string): Promise<UsernameCheckResponse> {
    try {
      const response = await apiService.get<UsernameCheckResponse>(`/users/check-username/${encodeURIComponent(username)}`);
      return {
        available: response.available,
        message: response.message
      };
    } catch (error: unknown) {
      // If we get a 404 or 409, it means username is taken
      if ((error as { response?: { status?: number } }).response?.status === 409) {
        return {
          available: false,
          message: 'Nome de usuário já está em uso'
        };
      }
      
      // For other errors, assume it's available (network issues, etc.)
      return {
        available: true,
        message: 'Erro ao verificar disponibilidade'
      };
    }
  }
}

export default new UsernameService();
