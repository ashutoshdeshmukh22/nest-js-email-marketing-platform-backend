import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  country: string;
}
