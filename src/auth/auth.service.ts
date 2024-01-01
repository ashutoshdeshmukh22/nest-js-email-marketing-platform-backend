import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OtpRepository } from 'src/user/repositories/otp.repository';
import { PassResetRepository } from 'src/user/repositories/passreset.repository';
import { UserService } from 'src/user/user.service';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
} from './dtos/auth-token-output.dto';
import { User } from 'src/user/entities/user.entity';
import { ERROR_CODES, SUCCESS_CODES } from 'src/shared/constants';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { UserLoginOutput, UserOutput } from 'src/user/dto/user-output.dto';
import { LoginInput } from './dtos/auth-login-input.dto';
import { CreateUserInput } from 'src/user/dto/user-create-input.dto';
import { OtpInput } from './dtos/auth-otp-input.dto';
import { RefreshTokenInput } from './dtos/auth-refresh-token-input.dto';
import { ResetPassInput } from './dtos/auth-forgot-password-input.dto';
import { NewPassInput } from './dtos/auth-new-password-input.dto';
import { UserRepository } from 'src/user/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private otpRepo: OtpRepository,
    private passResetRepo: PassResetRepository,
    private userRepo: UserRepository,
  ) {}

  async validateUser(
    ctx: any,
    email: string,
    pass: string,
  ): Promise<UserAccessTokenClaims> {
    // The userService will throw Unauthorized in case of invalid username/password.
    const user = await this.userService.validateUsernamePassword(
      ctx,
      email,
      pass,
    );

    // Prevent disabled users from logging in.
    if (user.isActive) {
      throw new UnauthorizedException('This user account has been disabled');
    }

    return user;
  }

  async login(res: Response, ctx: any, credential: LoginInput): Promise<any> {
    // find the user by email
    const user: User = await this.userService.getUserByEmail(
      credential.email.toLowerCase(),
    );

    // if the user does not exists
    if (!user || !user.isActive || !user.password) {
      res.status(HttpStatus.FORBIDDEN).json({
        message: ERROR_CODES.INVALID_CREDENTIALS,
      });
      return;
    }
    // compare the password
    const isPwMatch: boolean = await bcrypt.compare(
      credential.password,
      user.password,
    );
    // if the password is incorrect throw an exception
    if (!isPwMatch) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: ERROR_CODES.INVALID_CREDENTIALS,
      });
      return;
    }

    const token = await this.getAuthToken(user);

    // save tokens to db
    await this.userService.saveTokenToDb(user.id, token);

    const userDto = new UserLoginOutput(user);

    if (user && !user.isEmailVerified) {
      res.status(HttpStatus.FORBIDDEN).json({
        message: ERROR_CODES.EMAIL_NOT_VERIFIED_LOGIN,
        user: userDto,
        token,
      });
      return;
    }

    res.status(HttpStatus.OK).json({
      message: SUCCESS_CODES.LOGGED_IN_SUCCESS,
      user: userDto,
      token,
    });
  }

  async register(
    res: Response,
    ctx: any,
    input: CreateUserInput,
  ): Promise<any> {
    // Check if the user with the email is already exist or not
    const user: User = await this.userService.getUserByEmail(
      input.email.toLowerCase(),
    );

    if (user && !user.isEmailVerified) {
      const token = await this.getAuthToken(user);
      // save tokens to db
      const updateUser = await this.userService.saveTokenToDb(user.id, token);
      res.status(403).json({
        message: ERROR_CODES.EMAIL_NOT_VERIFIED_REGISTER,
        userId: updateUser.id,
        email: updateUser.email,
        isEmailVerified: updateUser.isEmailVerified,
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        token,
      });
      return;
    }

    // If the user is exists then log in the user
    if (user) {
      res.status(HttpStatus.CONFLICT).json({
        message: ERROR_CODES.ACCOUNT_EXIST_ERROR,
      });
      return;
    }

    const registeredUser: User = await this.userService.createUser(ctx, input);

    if (!registeredUser)
      res.status(HttpStatus.FORBIDDEN).json({
        message: ERROR_CODES.USER_NOT_ADDED,
      });
    let user_name: string;
    if (registeredUser.firstName && registeredUser.lastName) {
      user_name = ` ${registeredUser.firstName} ${registeredUser.lastName}`;
    } else if (registeredUser.firstName) {
      user_name = ` ${registeredUser.firstName}`;
    } else {
      user_name = '';
    }
    // Send the OTP to the user's email address
    const otp: number = await this.userService.createOTP(registeredUser);
    // const mailData: SendMailDto = {
    //   templateId: Number(process.env.POSTMARK_OTP_VERIFICATION_TEMPLATE_ID),
    //   receiverEmail: registeredUser.email,
    //   payload: {
    //     user_name,
    //     otp,
    //     support_url: process.env.SUPPORT_URL,
    //     kyros: process.env.KYROS,
    //   },
    // };
    // await this.postmarkService.sendMail(mailData);

    // Get New Token And Save Refresh Token To Db
    const token = await this.getAuthToken(registeredUser);

    // save tokens to db
    await this.userService.saveTokenToDb(registeredUser.id, token);

    const userDto = new UserOutput(registeredUser);

    res.status(HttpStatus.CREATED).json({
      message: SUCCESS_CODES.ACCOUNT_CREATED,
      user: userDto,
      token,
    });
  }

  async verifyOtp(ctx: any, input: OtpInput, res: Response): Promise<any> {
    // Get the user from db
    const user = await this.userService.getUserByEmail(ctx.user.email);
    console.log(user);
    if (!user) {
      throw new NotFoundException(ERROR_CODES.USER_NOT_FOUND);
    }
    const userId = user.id;
    // Retrieve the OTP from the database based on the user
    // const otp = await this.otpRepo.findOne({ where: { user } });
    const otp = await this.otpRepo
      .createQueryBuilder('otp')
      .leftJoin('otp.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    console.log(otp);

    if (!otp) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: ERROR_CODES.OTP_NOT_FOUND,
      });
      return;
    }
    console.log(otp.otp != input.otp);
    console.log(otp.otp, ' = ', input.otp);
    // Check Otp
    if (otp.otp != input.otp) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: ERROR_CODES.INCORRECT_OTP,
      });
      return;
    }
    // Check expiration with expires field
    if (otp.otpExpires || otp.otpExpiration < new Date()) {
      // And Automatically Send New OTP
      this.resendOtp(ctx, res);
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: ERROR_CODES.OTP_EXPIRED,
      });
      return;
    }

    // Mark Otp Expires to true
    otp.otpExpires = true;
    await this.otpRepo.save(otp);

    // If OTP is Correct and Verified
    // Update the user Activation Status to true
    const updatedUser = await this.userService.updateUser(user.id, ctx);
    // Generating Updated Token
    const token = await this.getAuthToken(updatedUser);
    // save tokens to db
    const newUser = await this.userService.saveTokenToDb(updatedUser.id, token);

    // Update Onboarding Status To WORKSPACE_CREATION
    const userDto = new UserOutput(newUser);

    res.status(HttpStatus.OK).json({
      Message: SUCCESS_CODES.USER_VERIFIED,
      user: userDto,
      token,
    });
  }

  // Forgot Password
  async forgotPassword(
    input: ResetPassInput,
    req: Request,
    res: Response,
  ): Promise<any> {
    // Get the user from db
    const user = await this.userService.getUserByEmail(
      input.email.toLowerCase(),
    );
    if (!user) {
      throw new NotFoundException(ERROR_CODES.USER_NOT_FOUND);
    }
    // Generate Password Reset token by adding user to payload
    const resetToken = await this.userService.createPasswordResetToken(user);

    // Save the Reset Token To Db
    await this.userService.saveResetToken(resetToken, user);

    // Generate Password Reset URL
    const host = process.env.FRONTEND_HOST;
    const protocol = req.protocol;

    const resetPassLink = `${protocol}://${host}/reset_password?email=${input.email}&token=${resetToken}`;

    let user_name: string;
    if (user.firstName && user.lastName) {
      user_name = ` ${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      user_name = ` ${user.firstName}`;
    } else {
      user_name = '';
    }
    // Send The Password Reset Link To User's Email
    // const mailData: SendMailDto = {
    //   templateId: Number(process.env.POSTMARK_RESET_PASSWORD_TEMPLATE_ID),
    //   receiverEmail: user.email,
    //   payload: {
    //     user_name,
    //     action_url: resetPassLink,
    //     support_url: process.env.SUPPORT_URL,
    //     kyros: process.env.KYROS,
    //   },
    // };

    // await this.postmarkService.sendMail(mailData);

    res.status(HttpStatus.OK).json({
      message: SUCCESS_CODES.PASSWORD_RESET_MAIL_SUCCESS,
    });
  }

  // Set New Password
  async resetPassword(
    input: NewPassInput,
    req: Request,
    res: Response,
    resetToken: string,
  ) {
    // Check The User with the provided email exists or not
    const isUserExist = await this.userService.getUserByEmail(
      input.email.toLowerCase(),
    );
    if (!isUserExist) {
      throw new NotFoundException(ERROR_CODES.USER_NOT_FOUND);
    }

    // Validate the reset token - Get the reset token object from db which is same as the reset token from the params
    const resetTokenObj = await this.passResetRepo.findOne({
      where: { resetToken },
    });

    if (
      !resetTokenObj ||
      resetTokenObj.resetTokenExpires ||
      resetTokenObj.resetTokenExpiration < new Date()
    ) {
      // Handle error case: Invalid or expired reset token
      return res.status(HttpStatus.FORBIDDEN).json({
        message: ERROR_CODES.RESET_LINK_EXPIRED,
      });
    }

    // Get the user associated with the Reset Token
    const user = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.resetPassToken', 'reset')
      .where('reset.resetToken = :resetToken', { resetToken })
      .getOne();

    // Update the Password
    user.password = await bcrypt.hash(input.password, 12);
    user.passwordChangedAt = Math.floor(Date.now() / 1000);
    await this.userRepo.save(user);

    // Set Reset Token Expires To true
    resetTokenObj.resetTokenExpires = true;
    await this.passResetRepo.save(resetTokenObj);

    return res
      .status(HttpStatus.OK)
      .json({ message: SUCCESS_CODES.PASSWORD_RESET_SUCCESS });
  }

  // Internal Methods
  async resendOtp(ctx: any, res: Response) {
    // Get the user from db
    const user = await this.userService.getUserByEmail(ctx.user.email);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: ERROR_CODES.USER_NOT_FOUND,
      });
    }
    const userId = user.id;
    // Retrieve the OTP from the database based on the user
    const otp = await this.otpRepo
      .createQueryBuilder('otp')
      .leftJoin('otp.user', 'user')
      .where('user.id = :userId', { userId })
      .getOne();

    let updatedOtp;
    // Send Old OTP Until it Expires
    if (otp.otpExpiration > new Date()) {
      updatedOtp = otp.otp;
    } else {
      updatedOtp = await this.userService.resetOtp(user, otp);
    }

    let user_name: string;
    if (user.firstName && user.lastName) {
      user_name = ` ${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      user_name = ` ${user.firstName}`;
    } else {
      user_name = '';
    }
    // Send the otp via email
    // const mailData: SendMailDto = {
    //   templateId: Number(process.env.POSTMARK_OTP_VERIFICATION_TEMPLATE_ID),
    //   receiverEmail: user.email,
    //   payload: {
    //     user_name,
    //     otp: updatedOtp,
    //     support_url: process.env.SUPPORT_URL,
    //     kyros: process.env.KYROS,
    //   },
    // };
    // await this.postmarkService.sendMail(mailData);

    res.status(HttpStatus.CREATED).json({
      message: SUCCESS_CODES.OTP_SENT,
      updatedOtp,
    });
  }

  async refreshToken(credential: RefreshTokenInput): Promise<AuthTokenOutput> {
    const user = await this.userService.getUserByRefreshToken(
      credential.refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException(ERROR_CODES.REFRESH_TOKEN_INVALID);
    }
    const token = await this.getAuthToken(user);
    user.refreshToken = token.refreshToken;
    await this.userService.updateUserDetail(user);
    return token;
  }

  async getAuthToken(user: User): Promise<AuthTokenOutput> {
    const subject = { sub: user.id };

    const payload = {
      email: user.email,
      id: user.id,
      isActive: user.isActive,
      IsEmailVerified: user.isEmailVerified,
      role: user.role,
    };

    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        secret: process.env.JWT_SECRET,
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        {
          expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
          secret: process.env.JWT_SECRET,
        },
      ),
    };
    return authToken;
  }
}
