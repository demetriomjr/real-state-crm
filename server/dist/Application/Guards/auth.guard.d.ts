import { ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@/Application/DTOs/Authorization/jwt-payload.dto';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
    handleRequest<TUser = JwtPayload>(err: any, user: TUser, info: any, context: ExecutionContext): TUser;
}
export {};
