import { IAuditBase } from "../Interfaces/IAuditBase";
export declare class Business implements IAuditBase {
    id: string;
    company_name: string;
    subscription: number;
    created_at: Date;
    created_by?: string;
    updated_at: Date;
    updated_by?: string;
    deleted_at?: Date;
    deleted_by?: string;
    constructor(data: Partial<Business>);
    validate(): boolean;
    isActive(): boolean;
    hasActiveSubscription(): boolean;
    getSubscriptionLevel(): string;
}
