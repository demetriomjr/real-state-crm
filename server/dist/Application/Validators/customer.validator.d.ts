export declare class CustomerValidator {
    private readonly logger;
    private readonly expectedCustomerTypes;
    private readonly expectedCustomerStatuses;
    validateCreate(data: any): Promise<void>;
    validateUpdate(data: any): Promise<void>;
}
