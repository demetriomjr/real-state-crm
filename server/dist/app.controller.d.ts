import { AppService } from './app.service';
import { Response } from 'express';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHomePage(res: Response): void;
    getHello(): string;
    getHealth(): {
        status: string;
        timestamp: string;
    };
}
