import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { User } from '../entities/user.entity';
import { AuthTokenOutput } from 'src/auth/dtos/auth-token-output.dto';

export class UserLoginOutput {
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
  isActive: boolean;

  @Expose()
  @ApiProperty()
  isEmailVerified: boolean;

  @Expose()
  @ApiProperty()
  token: AuthTokenOutput;

  @Expose()
  @ApiProperty()
  passwordChangedAt: number;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.isActive = user.isActive;
    this.isEmailVerified = user.isEmailVerified;
    this.passwordChangedAt = user.passwordChangedAt;
  }
}

export class UserOutput extends UserLoginOutput {
  constructor(user: User) {
    super(user);
    this.workExperience = null;
    this.employeeId = null;
    this.role = null;
    this.isActive = null;
  }

  @Expose()
  @ApiProperty()
  workExperience: object;

  @Expose()
  @ApiProperty()
  employeeId: string;

  @Expose()
  @ApiProperty()
  role: object;
}
