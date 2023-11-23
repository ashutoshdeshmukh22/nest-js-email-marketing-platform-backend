import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';


export class AuthTokenOutput {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}

export class UserAccessTokenClaims {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  role: string;
}

export class UserRefreshTokenClaims {
  id: string;
}
