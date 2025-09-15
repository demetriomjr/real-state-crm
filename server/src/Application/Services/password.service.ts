import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { UserRepository } from "@/Infrastructure/Repositories/user.repository";
import {
  PasswordChangeDto,
  PasswordChangeResponseDto,
} from "@/Application/DTOs/Users/password-change.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async validatePasswordChange(
    userId: string,
    passwordChangeDto: PasswordChangeDto,
  ): Promise<PasswordChangeResponseDto> {
    this.logger.log(`Validating password change for user: ${userId}`);

    // Validate that new passwords match
    if (passwordChangeDto.newPassword !== passwordChangeDto.confirmPassword) {
      throw new BadRequestException("New passwords do not match");
    }

    // Get user from database
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      passwordChangeDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException("Current password is incorrect");
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(
      passwordChangeDto.newPassword,
      user.password,
    );

    if (isSamePassword) {
      throw new BadRequestException(
        "New password must be different from current password",
      );
    }

    // Encrypt the new password
    const saltRounds = 10;
    const encryptedPassword = await bcrypt.hash(
      passwordChangeDto.newPassword,
      saltRounds,
    );

    this.logger.log(`Password validation successful for user: ${userId}`);

    return {
      encryptedPassword,
      message: "Password validation successful",
      status: 200,
    };
  }
}
