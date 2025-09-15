import apiService from './api';
import type { LoginRequest, LoginResponse, User } from '../types/auth';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Backend now returns AuthorizationResponseDto directly, not wrapped in a LoginResponse
    const response = await apiService.post<{
      token: string;
      userSecret: string;
      expires_at: Date;
      userId: string;
      userFullName: string;
    }>('/auth/login', credentials);
    
    // Construct User object from secure response fields
    const user: User = {
      id: response.userId,
      fullName: response.userFullName,
      // Note: username, user_level, and roles removed for security
    };
    
    // Construct LoginResponse for compatibility
    const loginResponse: LoginResponse = {
      token: response.token,
      userSecret: response.userSecret,
      expires_at: response.expires_at.toString(),
      user: user,
    };
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('userSecret', response.userSecret);
    localStorage.setItem('tokenExpiry', response.expires_at.toString());
    localStorage.setItem('user', JSON.stringify(user));
    
    return loginResponse;
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
    // Backend now returns AuthorizationResponseDto directly
    const response = await apiService.post<{
      token: string;
      userSecret: string;
      expires_at: Date;
      userId: string;
      userFullName: string;
    }>('/auth/refresh');
    
    // Construct User object from secure response fields
    const user: User = {
      id: response.userId,
      fullName: response.userFullName,
      // Note: username, user_level, and roles removed for security
    };
    
    // Construct LoginResponse for compatibility
    const loginResponse: LoginResponse = {
      token: response.token,
      userSecret: response.userSecret,
      expires_at: response.expires_at.toString(),
      user: user,
    };
    
    localStorage.setItem('token', response.token);
    localStorage.setItem('userSecret', response.userSecret);
    localStorage.setItem('tokenExpiry', response.expires_at.toString());
    localStorage.setItem('user', JSON.stringify(user));
    
    return loginResponse;
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
