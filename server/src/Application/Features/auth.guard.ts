import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from '@/Application/DTOs/Authorization';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtPayload>(err: any, user: TUser, info: any, context: ExecutionContext): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('Authentication required');
    }

    // Inject tenant_id, user_id, and user_level into request object
    const request = context.switchToHttp().getRequest<Request>();
    const jwtUser = user as JwtPayload;
    request['tenantId'] = jwtUser.tenant_id;
    request['userId'] = jwtUser.user_id;
    request['userLevel'] = jwtUser.user_level;
    request['user'] = jwtUser;

    return user;
  }
}
