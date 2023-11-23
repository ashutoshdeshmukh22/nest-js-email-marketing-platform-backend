import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserOnboardInput {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200)
  @IsString()
  firstName: string;

  @ApiProperty()
  @MaxLength(200)
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  timezone: object;
}
