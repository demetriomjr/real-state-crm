import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { BusinessService } from "@/Application/Services/business.service";
import { ConfigService } from "@nestjs/config";
export declare class TenantValidationMiddleware implements NestMiddleware {
    private readonly businessService;
    private readonly configService;
    private readonly logger;
    constructor(businessService: BusinessService, configService: ConfigService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
