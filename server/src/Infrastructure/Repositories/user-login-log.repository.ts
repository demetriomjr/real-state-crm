import { Injectable } from "@nestjs/common";
import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { UserLoginLog } from "../../Domain/Users/UserLoginLog";
import { CreateUserLoginLogDto } from "../../Application/DTOs/Users/user-login-log.dto";

@Injectable()
export class UserLoginLogRepository {
  constructor(private readonly prisma: MainDatabaseContext) {}

  async create(
    createUserLoginLogDto: CreateUserLoginLogDto,
  ): Promise<UserLoginLog> {
    const userLoginLog = await this.prisma.userLoginLog.create({
      data: {
        user_id: createUserLoginLogDto.user_id,
        tenant_id: createUserLoginLogDto.tenant_id,
        login_at: new Date(),
        ip_address: createUserLoginLogDto.ip_address,
        user_agent: createUserLoginLogDto.user_agent,
        success: createUserLoginLogDto.success,
        failure_reason: createUserLoginLogDto.failure_reason,
      },
    });

    return new UserLoginLog(userLoginLog);
  }

  async findByUserId(
    userId: string,
    limit: number = 10,
  ): Promise<UserLoginLog[]> {
    const userLoginLogs = await this.prisma.userLoginLog.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        login_at: "desc",
      },
      take: limit,
    });

    return userLoginLogs.map((log) => new UserLoginLog(log));
  }

  async findMany(options: {
    where: any;
    skip: number;
    take: number;
    orderBy: any;
  }): Promise<UserLoginLog[]> {
    const userLoginLogs = await this.prisma.userLoginLog.findMany({
      where: options.where,
      skip: options.skip,
      take: options.take,
      orderBy: options.orderBy,
    });

    return userLoginLogs.map((log) => new UserLoginLog(log));
  }

  async count(options: { where: any }): Promise<number> {
    return this.prisma.userLoginLog.count({
      where: options.where,
    });
  }
}
