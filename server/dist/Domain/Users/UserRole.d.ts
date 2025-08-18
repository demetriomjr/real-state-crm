import { IAuditBase } from '../Interfaces/IAuditBase';
export declare class UserRole implements IAuditBase {
    id: string;
    user_id: string;
    role: string;
    is_allowed: boolean;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<UserRole>);
    validate(): boolean;
    isActive(): boolean;
    hasRole(roleName: string): boolean;
}
