export interface JwtPayload {
  tenant_id: string; // Primary key, no sub field
  user_id: string; // User ID instead of username
  user_level: number; // User level for authorization
  iat?: number;
  exp?: number;
}
