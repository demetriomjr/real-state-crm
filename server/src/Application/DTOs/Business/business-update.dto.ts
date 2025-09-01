import { IsString, IsOptional, IsInt, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BusinessUpdateDto {
  @ApiProperty({
    description: "Company name",
    example: "Acme Corporation",
    required: false,
  })
  @IsOptional()
  @IsString()
  company_name?: string;

  @ApiProperty({
    description: "Subscription level (0-10)",
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  subscription?: number;
}
