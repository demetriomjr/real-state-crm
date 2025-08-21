import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthorizationService } from '@/Application/Services/authorization.service';
import { JwtPayload } from '@/Application/DTOs/Authorization';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authorizationService: AuthorizationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Skip validation in development environment if configured
    if (this.authorizationService.isDevelopmentEnvironment()) {
      return payload;
    }

    // Ensure tenant_id is present
    if (!payload.tenant_id) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    // Ensure user_level is present
    if (payload.user_level === undefined || payload.user_level === null) {
      throw new UnauthorizedException('User level is required');
    }



    return payload;
  }
}
