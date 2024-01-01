import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { ERROR_CODES } from '../constants';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async use(req: any, res: any, next: NextFunction) {
    let token: string;
    if (!req.headers.authorization) token = req.headers['token'];
    else token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(ERROR_CODES.JWT_TOKEN_NOT_FOUND);
    }
    try {
      const decodedToken = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      req.user = decodedToken;
      let passwordChangedAt;
      const user = await this.userService.getUserById(req, req.user.id);
      if (!user) {
        passwordChangedAt = (await this.userService.findById(req, req.user.id))
          .passwordChangedAt;
      } else {
        passwordChangedAt = user['passwordChangedAt'];
      }
      if (passwordChangedAt != null && passwordChangedAt > req.user.iat) {
        throw new UnauthorizedException(ERROR_CODES.INVALID_JWT_TOKEN);
      }

      next();
    } catch (error) {
      throw new UnauthorizedException(ERROR_CODES.INVALID_JWT_TOKEN);
    }
  }
}
