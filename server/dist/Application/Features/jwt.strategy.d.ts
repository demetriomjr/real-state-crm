import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthorizationService } from '@/Application/Services/authorization.service';
import { JwtPayload } from '@/Application/DTOs/Authorization';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly authorizationService;
    constructor(configService: ConfigService, authorizationService: AuthorizationService);
    validate(payload: JwtPayload): Promise<JwtPayload>;
}
export {};
