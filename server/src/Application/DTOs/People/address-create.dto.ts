import { IsString, IsNotEmpty, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddressCreateDto {
  @ApiProperty({ description: "Street address", example: "123 Main St" })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: "City", example: "São Paulo" })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: "State/Province", example: "SP" })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: "Postal code", example: "01234-567" })
  @IsString()
  @IsNotEmpty()
  postal_code: string;

  @ApiProperty({ description: "Country", example: "Brazil" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: "Person ID", example: "uuid-string" })
  @IsString()
  @IsNotEmpty()
  person_id: string;

  @ApiProperty({
    description: "Is primary address",
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: "Is default address",
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}
