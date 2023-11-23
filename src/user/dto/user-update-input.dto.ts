import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserInput {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(255)
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MaxLength(255)
  @IsString()
  lastName: string;
}
