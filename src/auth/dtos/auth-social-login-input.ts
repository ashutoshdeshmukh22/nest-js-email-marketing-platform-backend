import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SocialLoginInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  jwt: string;
}
