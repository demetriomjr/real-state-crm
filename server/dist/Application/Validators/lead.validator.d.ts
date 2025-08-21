export declare class LeadValidator {
    private readonly logger;
    private readonly expectedLeadTypes;
    private readonly expectedLeadStatuses;
    private readonly expectedLeadTemperatures;
    private readonly expectedLeadOrigins;
    validateCreate(data: any): Promise<void>;
    validateUpdate(data: any): Promise<void>;
}
