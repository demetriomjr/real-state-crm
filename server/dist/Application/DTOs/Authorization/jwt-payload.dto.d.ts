export interface JwtPayload {
    tenant_id: string;
    user_id: string;
    user_level: number;
    refresh_id?: number;
    iat?: number;
    exp?: number;
}
