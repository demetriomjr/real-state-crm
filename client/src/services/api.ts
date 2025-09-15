import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { sanitizeError } from '../utils/errorHandler';

// Types for API responses
interface Contact {
  id?: string;
  contact_type: "email" | "phone" | "cellphone";
  contact_value: string;
  is_default?: boolean;
}

interface Document {
  id?: string;
  document_type: 'cpf' | 'cnpj' | 'rg' | 'passport' | 'driver_license';
  document_number: string;
  is_default?: boolean;
}

interface Address {
  id?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to decode JWT and get tenant ID
function getTenantIdFromToken(): string {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found in localStorage');
  }
  
  try {
    // Decode JWT (without verification - we just need to read the payload)
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    
    if (!payload.tenantId) {
      throw new Error('No tenantId found in JWT token');
    }
    
    return payload.tenantId;
  } catch {
    throw new Error('Invalid JWT token format');
  }
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        const userSecret = localStorage.getItem('userSecret');
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (userSecret) {
          config.headers['X-User-Secret'] = userSecret;
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Clean up auth data on 401/403 errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userSecret');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiry');
        }
        
        // Sanitize the error before rejecting
        const sanitizedError = sanitizeError(error);
        error.sanitizedMessage = sanitizedError.message;
        error.shouldRedirectToLogin = sanitizedError.shouldRedirectToLogin;
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }

  // Password change validation
  async validatePasswordChange(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ encryptedPassword: string; message: string }> {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }
    
    // Use RESTful pattern: PUT /users/:id/password
    return this.put(`/users/${userId}/password`, data);
  }

  // User profile
  async getCurrentUserProfile(): Promise<{
    id: string;
    username: string;
    full_name: string;
    contacts: Contact[];
    documents: Document[];
    addresses: Address[];
  }> {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }
    
    // Use RESTful pattern: GET /users/:id
    return this.get(`/users/${userId}`);
  }

  // User profile with logs (using RESTful pattern)
  async getCurrentUserProfileWithLogs(): Promise<{
    id: string;
    username: string;
    full_name: string;
    contacts: Contact[];
    documents: Document[];
    addresses: Address[];
    logs?: {
      id: string;
      login_at: string;
      ip_address?: string;
      user_agent?: string;
      success: boolean;
      failure_reason?: string;
    }[];
  }> {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }
    
    // Use RESTful pattern with user ID from localStorage
    return this.get(`/users/${userId}?logs=true`);
  }

  async updateCurrentUserProfile(data: {
    username?: string;
    full_name?: string;
    password?: string;
    contacts?: Contact[];
    documents?: Document[];
    addresses?: Address[];
  }): Promise<{
    token: string;
    userSecret: string;
    expires_at: Date;
    userId: string;
    userFullName: string;
    // Note: username, userLevel, and userRoles removed for security - available in JWT payload only
  }> {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }
    
    // Use RESTful pattern: PUT /users/:id (returns new auth data for profile updates)
    return this.put(`/users/${userId}`, data);
  }

  // User login logs
  async getMyLoginHistory(limit?: number): Promise<{
    id: string;
    user_id: string;
    tenant_id: string;
    login_at: string;
    ip_address?: string;
    user_agent?: string;
    success: boolean;
    failure_reason?: string;
    created_at: string;
  }[]> {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;
    
    if (!userId) {
      throw new Error('User ID not found in localStorage');
    }
    
    // Use RESTful pattern: GET /users/:id/logs
    const params = limit ? `?limit=${limit}` : '';
    return this.get(`/users/${userId}/logs${params}`);
  }

  async getUserLogsWithFilters(
    userId: string,
    filters?: {
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<{
    logs: {
      id: string;
      login_at: string;
      ip_address?: string;
      user_agent?: string;
      success: boolean;
      failure_reason?: string;
    }[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const url = `/users/${userId}/logs${queryString ? `?${queryString}` : ''}`;
    return this.get(url);
  }

  // Business methods using RESTful pattern
  async getCurrentBusiness(): Promise<{
    id: string;
    company_name: string;
    subscription_level: string;
    created_at: string;
    full_name: string;
    contacts: Contact[];
    documents: Document[];
    addresses: Address[];
  }> {
    // Get tenant ID from JWT token (tenant ID = business ID)
    const tenantId = getTenantIdFromToken();
    
    // Use RESTful pattern: GET /businesses/:id (backend recognizes this as "me" request)
    return this.get(`/businesses/${tenantId}`);
  }

  async updateCurrentBusiness(data: {
    company_name?: string;
    full_name?: string;
    contacts?: Contact[];
    documents: Document[];
    addresses?: Address[];
  }): Promise<{
    id: string;
    company_name: string;
    subscription_level: string;
    created_at: string;
    full_name: string;
    contacts: Contact[];
    documents: Document[];
    addresses: Address[];
  }> {
    // Get tenant ID from JWT token (tenant ID = business ID)
    const tenantId = getTenantIdFromToken();
    
    // Use RESTful pattern: PUT /businesses/:id (backend recognizes this as "me" request)
    return this.put(`/businesses/${tenantId}`, data);
  }
}

export const apiService = new ApiService();
export default apiService;
