import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./Infrastructure/Database/database.module";
import { UserModule } from "./Application/Modules/user.module";
import { AuthorizationModule } from "./Application/Modules/authorization.module";
import { BusinessModule } from "./Application/Modules/business.module";
import { LeadModule } from "./Application/Modules/lead.module";
import { CustomerModule } from "./Application/Modules/customer.module";
import { ChatModule } from "./Application/Modules/chat.module";
import { FeedbackModule } from "./Application/Modules/feedback.module";
import { WebhooksModule } from "./Application/Modules/webhooks.module";
import { WhatsappSessionModule } from "./Application/Modules/whatsapp-session.module";
import { SSEChatModule } from "./Application/Modules/sse-chat.module";
import { TenantValidationInterceptor } from "./Application/Features/tenant-validation.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    UserModule,
    AuthorizationModule,
    BusinessModule,
    LeadModule,
    CustomerModule,
    ChatModule,
    FeedbackModule,
    WebhooksModule,
    WhatsappSessionModule,
    SSEChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantValidationInterceptor,
    },
  ],
})
export class AppModule {}
