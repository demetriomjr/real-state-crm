export interface JwtPayload {
  tenant_id: string; // Primary key, no sub field
  username: string;
  iat?: number;
  exp?: number;
}
