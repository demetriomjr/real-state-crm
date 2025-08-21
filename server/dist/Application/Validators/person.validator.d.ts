export declare class PersonValidator {
    private readonly logger;
    private readonly expectedDocumentTypes;
    validateCreate(data: any): Promise<void>;
    validateUpdate(data: any): Promise<void>;
    private validateDocumentNumberFormat;
    private isValidCPF;
    private isValidCNPJ;
    private isValidRG;
    private isValidPassport;
    private isValidDriverLicense;
    private isValidVoterId;
    private isValidWorkCard;
}
