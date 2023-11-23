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
  workspaceUrl: string;

  @Expose()
  @ApiProperty()
  token: AuthTokenOutput;

  @Expose()
  @ApiProperty()
  profileImage: string;

  @Expose()
  @ApiProperty()
  passwordChangedAt: number;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.businessRole = user.businessRole;
    this.isActive = user.isActive;
    this.isEmailVerified = user.isEmailVerified;
    this.googleId = user.googleId;
    this.microsoftId = user.microsoftId;
    this.profileImage = user.profileImage;
    this.workspaceUrl = null;
    this.passwordChangedAt = user.passwordChangedAt;
  }
}

export class UserOutput extends UserLoginOutput {
  constructor(user: User) {
    super(user);
    this.workExperience = null;
    this.employeeId = null;
    this.department = null;
    this.designation = null;
    this.invitationStatus = null;
    this.role = null;
    this.getSignedUrl = null;
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
  department: object;

  @Expose()
  @ApiProperty()
  designation: object;

  @Expose()
  @ApiProperty()
  invitationStatus: string;

  @Expose()
  @ApiProperty()
  role: object;

  @ApiProperty()
  getSignedUrl: string;
}
