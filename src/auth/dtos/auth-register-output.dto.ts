import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { AuthTokenOutput } from './auth-token-output.dto';

export class RegisterOutput {
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
  refreshToken: string;

  @Expose()
  @ApiProperty()
  role: string;

  @Expose()
  @ApiProperty()
  businessRole: string;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  isEmailVerified: boolean;

  @Expose()
  @ApiProperty()
  googleId: string;

  @Expose()
  @ApiProperty()
  microsoftId: string;

  @Expose()
  @ApiProperty()
  onboardStep: string;

  @Expose()
  @ApiProperty()
  token: AuthTokenOutput;
}
