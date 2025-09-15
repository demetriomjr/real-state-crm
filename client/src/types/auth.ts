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
  // Note: username, user_level, and roles removed for security - these are validated server-side only
  // and available in JWT payload. Frontend should not store or trust these values.
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
