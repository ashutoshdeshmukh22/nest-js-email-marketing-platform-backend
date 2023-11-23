import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserInput } from './dto/user-create-input.dto';
import { UpdateUserInput } from './dto/user-update-input.dto';
import { UserOutput } from './dto/user-output.dto';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from 'src/shared/dtos/base-api-response.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get User
  @Get('user')
  @ApiOperation({
    summary: 'Get user API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getMyProfile(@Req() ctx: any): Promise<BaseApiResponse<UserOutput>> {
    const user: User = await this.userService.getUserById(ctx, ctx.user.id);
    const userDto = new UserOutput(user);
    return { data: userDto };
  }
}
