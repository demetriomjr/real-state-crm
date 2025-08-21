export declare class ContactValidator {
    private readonly logger;
    private readonly expectedContactTypes;
    private readonly emailRegex;
    private readonly phoneRegex;
    private readonly whatsappRegex;
    private readonly cellphoneRegex;
    validateCreate(data: any): Promise<void>;
    validateUpdate(data: any): Promise<void>;
    private validateContactValueFormat;
    private isValidPhone;
    private isValidWhatsApp;
    private isValidCellphone;
    formatPhoneNumber(value: string, countryCode?: string): string;
    isValidBrazilianPhone(value: string): boolean;
}
