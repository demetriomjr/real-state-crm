import { IsString, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddressUpdateDto {
  @ApiProperty({
    description: "Street address",
    example: "123 Main St",
    required: false,
  })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({
    description: "City",
    example: "São Paulo",
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: "State/Province",
    example: "SP",
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({
    description: "Postal code",
    example: "01234-567",
    required: false,
  })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiProperty({
    description: "Country",
    example: "Brazil",
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    description: "Is primary address",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "Is default address",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
