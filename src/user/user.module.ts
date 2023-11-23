import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { OtpRepository } from './repositories/otp.repository';
import { PassResetRepository } from './repositories/passreset.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, OtpRepository, PassResetRepository],
  exports: [UserService, UserRepository, OtpRepository, PassResetRepository],
})
export class UserModule {}
