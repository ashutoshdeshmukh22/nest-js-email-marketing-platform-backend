import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserInput {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(100)
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @MaxLength(200)
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 100)
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;
}
