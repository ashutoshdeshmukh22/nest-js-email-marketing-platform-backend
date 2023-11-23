import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResetPassInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  email: string;
}
