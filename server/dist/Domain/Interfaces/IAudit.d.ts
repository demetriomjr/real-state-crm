import { IAuditBase } from "./IAuditBase";
export interface IAudit extends IAuditBase {
    tenant_id: string;
}
