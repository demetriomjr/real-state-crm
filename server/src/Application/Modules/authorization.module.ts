import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthorizationController } from "@/Application/Controllers/authorization.controller";
import { AuthorizationService } from "@/Application/Services/authorization.service";
import { UserSecretCacheService } from "@/Application/Services/user-secret-cache.service";
import { JwtStrategy } from "@/Application/Features/jwt.strategy";
import { UserModule } from "./user.module";
import { BusinessModule } from "./business.module";

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
    forwardRef(() => BusinessModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get<string>("JWT_EXPIRES_IN", "30m"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService, UserSecretCacheService, JwtStrategy],
  exports: [AuthorizationService, UserSecretCacheService, JwtStrategy],
})
export class AuthorizationModule {}
