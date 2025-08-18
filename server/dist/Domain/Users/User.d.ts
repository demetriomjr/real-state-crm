import { IAudit } from '../Interfaces/IAudit';
export declare class User implements IAudit {
    id: string;
    fullName: string;
    username: string;
    password: string;
    user_level: number;
    tenant_id: string;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<User>);
    validate(): boolean;
    isActive(): boolean;
    hasPermission(level: number): boolean;
}
