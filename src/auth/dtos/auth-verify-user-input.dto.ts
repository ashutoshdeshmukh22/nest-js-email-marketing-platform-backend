import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { AuthTokenOutput } from './auth-token-output.dto';

export class VerifyOtpOutput {
  @Expose()
  @ApiProperty()
  message: string;

  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  isEmailVerified: boolean;

  @Expose()
  @ApiProperty()
  token: AuthTokenOutput;
}
