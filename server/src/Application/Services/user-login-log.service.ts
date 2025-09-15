import { Injectable, Logger } from "@nestjs/common";
import { UserLoginLogRepository } from "../../Infrastructure/Repositories/user-login-log.repository";
import { CreateUserLoginLogDto } from "../DTOs/Users/user-login-log.dto";
import { UserLoginLogResponseDto } from "../DTOs/Users/user-login-log.dto";
import { UserLoginLog } from "../../Domain/Users/UserLoginLog";

@Injectable()
export class UserLoginLogService {
  private readonly logger = new Logger(UserLoginLogService.name);

  constructor(
    private readonly userLoginLogRepository: UserLoginLogRepository,
  ) {}

  async logLogin(
    createUserLoginLogDto: CreateUserLoginLogDto,
  ): Promise<UserLoginLogResponseDto> {
    this.logger.log(`Logging login for user: ${createUserLoginLogDto.user_id}`);

    const userLoginLog = await this.userLoginLogRepository.create(
      createUserLoginLogDto,
    );

    this.logger.log(
      `Login logged successfully for user: ${createUserLoginLogDto.user_id}`,
    );
    return this.mapToResponseDto(userLoginLog);
  }

  async getUserLoginHistory(
    userId: string,
    limit: number = 10,
  ): Promise<UserLoginLogResponseDto[]> {
    this.logger.log(`Getting login history for user: ${userId}`);

    const userLoginLogs = await this.userLoginLogRepository.findByUserId(
      userId,
      limit,
    );

    this.logger.log(
      `Found ${userLoginLogs.length} login records for user: ${userId}`,
    );
    return userLoginLogs.map((log) => this.mapToResponseDto(log));
  }

  async findByUserIdWithFilters(
    userId: string,
    filters: {
      startDate?: Date;
      endDate?: Date;
      page: number;
      limit: number;
    },
  ): Promise<{
    logs: UserLoginLogResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.log(
      `Fetching login logs for user ${userId} with filters: startDate=${filters.startDate}, endDate=${filters.endDate}, page=${filters.page}, limit=${filters.limit}`,
    );

    const skip = (filters.page - 1) * filters.limit;

    // Build where clause
    const whereClause: any = {
      user_id: userId,
    };

    // Add date filters if provided (date-only comparison, ignoring time)
    if (filters.startDate || filters.endDate) {
      whereClause.login_at = {};
      if (filters.startDate) {
        // Start date: from beginning of the day (00:00:00)
        const startOfDay = new Date(filters.startDate);
        startOfDay.setHours(0, 0, 0, 0);
        whereClause.login_at.gte = startOfDay;
      }
      if (filters.endDate) {
        // End date: to end of the day (23:59:59.999)
        const endOfDay = new Date(filters.endDate);
        endOfDay.setHours(23, 59, 59, 999);
        whereClause.login_at.lte = endOfDay;
      }
    }

    const [logs, total] = await Promise.all([
      this.userLoginLogRepository.findMany({
        where: whereClause,
        skip,
        take: filters.limit,
        orderBy: { login_at: "desc" },
      }),
      this.userLoginLogRepository.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(total / filters.limit);

    this.logger.log(
      `Found ${total} login logs for user ${userId}, returning ${logs.length} logs for page ${filters.page}`,
    );

    return {
      logs: logs.map((log) => this.mapToResponseDto(log)),
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages,
    };
  }

  private mapToResponseDto(
    userLoginLog: UserLoginLog,
  ): UserLoginLogResponseDto {
    return {
      id: userLoginLog.id,
      login_at: userLoginLog.login_at,
      ip_address: userLoginLog.ip_address,
      user_agent: userLoginLog.user_agent,
      success: userLoginLog.success,
      failure_reason: userLoginLog.failure_reason,
      // Note: user_id, tenant_id, and created_at removed for security reasons
    };
  }
}
