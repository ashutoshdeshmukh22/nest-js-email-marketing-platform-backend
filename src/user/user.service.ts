import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserInput } from './dto/user-create-input.dto';
import { plainToClass } from 'class-transformer';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';
import { OtpRepository } from './repositories/otp.repository';
import { PassResetRepository } from './repositories/passreset.repository';
import { Otp } from 'src/auth/entities/otp.entity';
import { PasswordReset } from 'src/auth/entities/passwordreset.entity';
import { compare } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private repository: UserRepository,
    private otpRepo: OtpRepository,
    private passResetRepo: PassResetRepository,
  ) {}
  async createUser(ctx: any, input: CreateUserInput): Promise<User> {
    const user = plainToClass(User, input);

    user.email = input.email.toLowerCase();
    user.password = await bcrypt.hash(input.password, 12);

    const userItem = await this.repository.save(user);

    userItem.createdBy = userItem.id;
    userItem.updatedBy = userItem.id;
    await this.repository.updateUser(userItem, ctx);
    return userItem;
  }

  async createOTP(user: User): Promise<number> {
    // Generate the OTP and send it to the user's email address
    const generatedOtp = this.generateOtp();

    // Set OTP expiration to 10 minutes from the current time
    const otpExpiration = new Date();
    otpExpiration.setMinutes(
      otpExpiration.getMinutes() + Number(process.env.OTP_EXPIRES_IN_MINUTES),
    );

    const otpObj = {
      otp: generatedOtp,
      otpExpiration: otpExpiration,
      otpExpires: false,
      user: user,
      createdBy: user.id,
      updatedBy: user.id,
    };

    // Save the OTP to the database
    const savedOTP = await this.otpRepo.save(otpObj);

    return savedOTP.otp;
  }

  async resetOtp(user: User, otp: Otp) {
    // Generate the OTP
    const newOtp = this.generateOtp();
    // Set OTP expiration to 10 minutes from the current time
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    // Update the OTP to the database
    const userId = user.id;
    await this.otpRepo
      .createQueryBuilder()
      .update(Otp)
      .set({
        otp: newOtp,
        otpExpiration: otpExpiration,
        otpExpires: false,
        updatedBy: user.id,
      })
      .where('user.id = :userId', { userId })
      .execute();
    return newOtp;
  }

  // Private Methods
  private generateOtp() {
    const random = Math.random();
    return Math.floor(100000 + random * 900000);
  }

  async validateUsernamePassword(
    ctx: any,
    email: string,
    pass: string,
  ): Promise<User> {
    const user: User = await this.repository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException();

    const match = await compare(pass, user.password);
    if (!match) throw new UnauthorizedException();

    return plainToClass(User, user, {
      excludeExtraneousValues: true,
    });
  }

  // Get User By Email
  async getUserByEmail(email: string): Promise<User> {
    return await this.repository.getUserByEmail(email);
  }

  async findById(ctx: any, id: string): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    return user;
  }

  async getUserById(ctx: any, id: string): Promise<User> {
    const user = await this.repository.getById(id);
    return plainToClass(User, user, {
      excludeExtraneousValues: true,
    });
  }

  async getUserByRefreshToken(refreshToken: string) {
    return await this.repository.getUserBYRefreshToken(refreshToken);
  }

  async updateUserDetail(user: User) {
    return await this.repository.save(user);
  }

  // Update User
  async updateUser(userId: string, ctx: any): Promise<User> {
    const user: User = await this.repository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    user.isActive = true; // Update the isActive property to true
    user.isEmailVerified = true;
    user.updatedBy = userId;

    await this.repository.updateUser(user, ctx);
    return user;
  }

  async saveTokenToDb(
    userId: string,
    token?: { refreshToken: string; accessToken: string },
  ): Promise<User> {
    const user: User = await this.repository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    user.refreshToken = token.refreshToken;
    const updatedUser = await this.repository.save(user);
    return updatedUser;
  }

  // Create Password Reset Token
  async createPasswordResetToken(user: User): Promise<string> {
    const resetToken = await crypto
      .getRandomValues(new Uint32Array(1))[0]
      .toString();
    return resetToken;
  }

  // save Reset Token To DB
  async saveResetToken(resetToken: string, user: User): Promise<PasswordReset> {
    // Check if a reset token already exists for the user
    const resetTokenInDb = await this.passResetRepo.findOne({
      where: { user: { id: user.id } },
    });

    // If Reset Token Already Exist Replace The Reset Token
    if (resetTokenInDb) {
      // Replace the reset token with new one
      resetTokenInDb.resetToken = resetToken;
      resetTokenInDb.resetTokenExpiration = new Date();
      resetTokenInDb.resetTokenExpiration.setMinutes(
        resetTokenInDb.resetTokenExpiration.getMinutes() +
          Number(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES),
      );
      resetTokenInDb.resetTokenExpires = false;
      return await this.passResetRepo.save(resetTokenInDb);
    } else {
      // If Reset Token Does not Exist Add The Reset Token
      // Set Reset Token expiration to 10 minutes from the current time
      const tokenExpiration = new Date();
      tokenExpiration.setMinutes(
        tokenExpiration.getMinutes() +
          Number(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES),
      );

      const resetTokenObj = {
        resetToken,
        resetTokenExpiration: tokenExpiration,
        resetTokenExpires: false,
        user: user,
        createdBy: user.id,
        updatedBy: user.id,
      };

      return await this.passResetRepo.save(resetTokenObj);
    }
  }
}
