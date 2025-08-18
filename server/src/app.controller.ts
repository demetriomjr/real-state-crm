import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API welcome message' })
  @ApiResponse({ status: 200, description: 'Returns welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get API health status' })
  @ApiResponse({ status: 200, description: 'Returns health status and timestamp' })
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }
}
