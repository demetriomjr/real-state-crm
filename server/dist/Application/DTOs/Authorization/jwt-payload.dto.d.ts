export interface JwtPayload {
    tenant_id: string;
    username: string;
    iat?: number;
    exp?: number;
}
