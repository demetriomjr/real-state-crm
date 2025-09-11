export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userSecret: string;
  expires_at: string;
  user: User;
}

export interface User {
  id: string;
  fullName: string;
  username: string;
  user_level: number;
  tenant_id: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateAuthData: (token: string, userSecret: string, expiresAt: string, userData?: User) => void;
  isAuthenticated: boolean;
  loading: boolean;
}
