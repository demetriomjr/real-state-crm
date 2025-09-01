import { Injectable } from "@nestjs/common";
import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { User } from "@/Domain/Users/User";
import { CreateUserDto, UpdateUserDto } from "@/Application/DTOs";

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: MainDatabaseContext) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { deleted_at: null },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.user.count({
        where: { deleted_at: null },
      }),
    ]);

    return {
      users: users.map((user) => new User(user)),
      total,
    };
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    return user ? new User(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
        deleted_at: null,
      },
    });

    return user ? new User(user) : null;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        fullName: createUserDto.fullName,
        username: createUserDto.username,
        password: createUserDto.password,
        user_level: createUserDto.user_level || 1,
        tenant_id: createUserDto.tenant_id,
      },
    });

    return new User(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(updateUserDto.fullName && { fullName: updateUserDto.fullName }),
        ...(updateUserDto.username && { username: updateUserDto.username }),
        ...(updateUserDto.password && { password: updateUserDto.password }),
        ...(updateUserDto.user_level && {
          user_level: updateUserDto.user_level,
        }),
        ...(updateUserDto.tenant_id && { tenant_id: updateUserDto.tenant_id }),
      },
    });

    return new User(user);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: "system", // This should come from auth context
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        id,
        deleted_at: null,
      },
    });
    return count > 0;
  }

  async findByTenant(tenant_id: string): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        tenant_id,
        deleted_at: null,
      },
      orderBy: { created_at: "desc" },
    });

    return users.map((user) => new User(user));
  }

  /**
   * PURGE - Permanently delete user from database
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   */
  async purge(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * PURGE USER ROLES - Permanently delete all user roles for a user
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   */
  async purgeUserRoles(userId: string): Promise<void> {
    await this.prisma.userRole.deleteMany({
      where: { user_id: userId },
    });
  }

  /**
   * PURGE BY TENANT - Permanently delete all users for a specific tenant
   * WARNING: This method permanently deletes data and cannot be undone
   * Should only be used for testing purposes or data cleanup
   */
  async purgeByTenant(tenant_id: string): Promise<void> {
    await this.prisma.user.deleteMany({
      where: { tenant_id },
    });
  }
}
