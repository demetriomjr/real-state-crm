import { IsString, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PasswordChangeDto {
  @ApiProperty({
    description: "Current password for verification",
    example: "currentPassword123",
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description:
      "New password (min 6 characters, must contain at least one letter and one number)",
    example: "newPassword123",
  })
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]/, {
    message: "Password must contain at least one letter and one number",
  })
  newPassword: string;

  @ApiProperty({
    description: "Confirmation of new password",
    example: "newPassword123",
  })
  @IsString()
  confirmPassword: string;
}

export class PasswordChangeResponseDto {
  @ApiProperty({
    description: "Encrypted new password ready for database update",
    example: "$2b$10$encryptedPasswordHash...",
  })
  encryptedPassword: string;

  @ApiProperty({
    description: "Success message",
    example: "Password validation successful",
  })
  message: string;

  @ApiProperty({
    description: "HTTP status code indicating the result",
    example: 200,
  })
  status: number;
}
