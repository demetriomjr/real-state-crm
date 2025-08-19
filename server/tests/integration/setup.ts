import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';

export class TestSetup {
  static app: INestApplication;
  static prisma: PrismaService;

  static async createTestingApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    await app.init();
    this.app = app;
    this.prisma = app.get<PrismaService>(PrismaService);
    return app;
  }

  static async cleanupDatabase(): Promise<void> {
    if (this.prisma) {
      // Clean up test data
      await this.prisma.user.deleteMany();
      await this.prisma.business.deleteMany();
    }
  }

  static async closeApp(): Promise<void> {
    if (this.app) {
      await this.cleanupDatabase();
      await this.app.close();
    }
  }
}
