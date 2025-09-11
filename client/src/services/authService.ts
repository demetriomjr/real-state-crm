import apiService from './api';
import type { LoginRequest, LoginResponse, User } from '../types/auth';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/login', credentials);
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('userSecret', response.userSecret);
    localStorage.setItem('tokenExpiry', response.expires_at);
    localStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userSecret');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>('/auth/refresh');
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('userSecret', response.userSecret);
    localStorage.setItem('tokenExpiry', response.expires_at);
    
    return response;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    const expiry = localStorage.getItem('tokenExpiry');
    
    if (!token || !expiry) {
      return false;
    }
    
    try {
      const now = new Date();
      const expiryDate = new Date(expiry);
      
      // Add a 5-minute buffer to prevent edge cases
      const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
      return now.getTime() < (expiryDate.getTime() - bufferTime);
    } catch (error) {
      console.error('Error validating token expiry:', error);
      return false;
    }
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export const authService = new AuthService();
export default authService;
