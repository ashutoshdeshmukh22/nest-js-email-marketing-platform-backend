import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Query,
  Res,
  Req,
  Put,
} from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  BaseApiErrorResponse,
  SwaggerBaseApiResponse,
} from 'src/shared/dtos/base-api-response.dto';
import { Subscriber } from './entities/subscriber.entity';

@ApiTags('Subscriber')
@Controller('subscriber')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) {}

  @Post('subscribe')
  @ApiOperation({
    summary: 'Create a Subscriber API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(Subscriber),
    description: 'Creation of Subscriber Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  async create(
    @Req() ctx: Request,
    @Res() res: Response,
    @Body() createSubscriberDto: CreateSubscriberDto,
  ) {
    return await this.subscriberService.create(ctx, res, createSubscriberDto);
  }

  // Create A Email List
  @Post('email-list')
  @ApiOperation({
    summary: 'Create a Subscriber API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([Subscriber]),
    description: 'Creation of Email List Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  async createEmailList(
    @Req() ctx: Request,
    @Res() res: Response,
    @Body() subscribers: CreateSubscriberDto[],
  ) {
    return await this.subscriberService.createEmailList(ctx, res, subscribers);
  }

  @Get()
  @ApiOperation({
    summary: 'Get All Subscriber API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([Subscriber]),
    description: 'Get All Subscriber Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  async findAll(@Res() res: Response) {
    return await this.subscriberService.findAll(res);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a Subscriber API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(Subscriber),
    description: 'Get Subscriber Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  async findOne(@Res() res: Response, @Param('id') id: string) {
    return await this.subscriberService.findOne(res, id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a Subscriber By Email API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(Subscriber),
    description: 'Get Subscriber Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  async findOneByEmail(@Res() res: Response, @Query('email') email: string) {
    return await this.subscriberService.findOneByEmail(res, email);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Subscriber API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(Subscriber),
    description: 'Update Subscriber Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() updateSubscriberDto: UpdateSubscriberDto,
  ) {
    return await this.subscriberService.update(res, id, updateSubscriberDto);
  }

  @Post('unsubscribe')
  @ApiOperation({
    summary: 'Un-Subscribe API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(Subscriber),
    description: 'Un-Subscribe Success',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  async unSubscribe(@Res() res: Response, @Query('email') email: string) {
    return await this.subscriberService.unSubscribe(res, email);
  }
}
