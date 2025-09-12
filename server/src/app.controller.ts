import { Controller, Get, Res } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiExcludeEndpoint,
} from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Response } from "express";
import { join } from "path";

@ApiTags("health")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  getHomePage(@Res() res: Response): void {
    res.sendFile(join(__dirname, "..", "public", "index.html"));
  }

  @Get("api")
  @ApiOperation({ summary: "Get API welcome message" })
  @ApiResponse({ status: 200, description: "Returns welcome message" })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("api/health")
  @ApiOperation({ summary: "Get API health status" })
  @ApiResponse({
    status: 200,
    description: "Returns health status and timestamp",
  })
  getHealth(): { status: string; timestamp: string } {
    return this.appService.getHealth();
  }
}
