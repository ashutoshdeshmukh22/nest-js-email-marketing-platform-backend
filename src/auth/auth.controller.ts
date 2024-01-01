import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ERROR_CODES, SUCCESS_CODES } from 'src/shared/constants';
import { RegisterOutput } from './dtos/auth-register-output.dto';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from 'src/shared/dtos/base-api-response.dto';
import { LoginInput } from './dtos/auth-login-input.dto';
import { CreateUserInput } from 'src/user/dto/user-create-input.dto';
import { VerifyOtpOutput } from './dtos/auth-verify-user-input.dto';
import { OtpInput } from './dtos/auth-otp-input.dto';
import { ResetPassInput } from './dtos/auth-forgot-password-input.dto';
import { NewPassInput } from './dtos/auth-new-password-input.dto';
import { AuthTokenOutput } from './dtos/auth-token-output.dto';
import { RefreshTokenInput } from './dtos/auth-refresh-token-input.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // login
  @Post('login')
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(RegisterOutput),
    description: SUCCESS_CODES.LOGGED_IN_SUCCESSFULLY,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
    description: ERROR_CODES.INVALID_CREDENTIALS,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `${ERROR_CODES.INVALID_CREDENTIALS} / ${ERROR_CODES.EMAIL_NOT_VERIFIED_LOGIN}`,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Req() ctx: any,
    @Res() res: Response,
    @Body() credential: LoginInput,
  ) {
    return await this.authService.login(res, ctx, credential);
  }

  // Register
  @Post('register')
  @ApiOperation({
    summary: 'User registration API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(RegisterOutput),
    description: SUCCESS_CODES.ACCOUNT_CREATED,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ERROR_CODES.ACCOUNT_EXIST_ERROR,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: `${ERROR_CODES.USER_NOT_ADDED} / ${ERROR_CODES.EMAIL_NOT_VERIFIED_REGISTER}`,
  })
  async registerLocal(
    @Req() ctx: any,
    @Body() input: CreateUserInput,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.authService.register(res, ctx, input);
  }

  // Verify otp
  @ApiBearerAuth('access-token')
  @Post('verification')
  @ApiOperation({
    summary: 'User Verification API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(VerifyOtpOutput),
    description: SUCCESS_CODES.USER_VERIFIED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${ERROR_CODES.USER_NOT_FOUND} / ${ERROR_CODES.OTP_NOT_FOUND}`,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: `${ERROR_CODES.INCORRECT_OTP} / ${ERROR_CODES.OTP_EXPIRED}`,
  })
  async verify(@Req() ctx: any, @Body() input: OtpInput, @Res() res: Response) {
    return await this.authService.verifyOtp(ctx, input, res);
  }

  // Resend OTP
  @ApiBearerAuth('access-token')
  @Post('resend-otp')
  @ApiOperation({
    summary: 'OTP Resend API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(OtpInput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `${ERROR_CODES.USER_NOT_FOUND}`,
  })
  async resendOtp(@Req() ctx: any, @Res() res: Response) {
    return await this.authService.resendOtp(ctx, res);
  }

  // Forgot Password
  @Post('forgot-password')
  @ApiOperation({
    summary: 'Forgot Password API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_CODES.USER_NOT_FOUND,
  })
  async forgotPassword(
    @Body() input: ResetPassInput,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.authService.forgotPassword(input, req, res);
  }

  @Post('resend-link')
  @ApiOperation({
    summary: 'Resend Forget Password Link API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_CODES.USER_NOT_FOUND,
  })
  async forgetPasswordResendLink(
    @Body() input: ResetPassInput,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.authService.forgotPassword(input, req, res);
  }

  // Forgot Password
  @Post('reset-password')
  @ApiOperation({
    summary: 'Set New Password API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(RegisterOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_CODES.USER_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: ERROR_CODES.RESET_LINK_EXPIRED,
  })
  async resetPassword(
    @Body() input: NewPassInput,
    @Req() req: Request,
    @Res() res: Response,
    @Query('token') resetToken: string,
  ) {
    return await this.authService.resetPassword(input, req, res, resetToken);
  }

  // Refresh Token
  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: RefreshTokenInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const authToken = await this.authService.refreshToken(credential);
    return { data: authToken };
  }
}
