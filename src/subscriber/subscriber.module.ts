import { Module } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import { SubscriberRepository } from './repositories/subscriber.repository';

@Module({
  controllers: [SubscriberController],
  providers: [SubscriberService, SubscriberRepository],
  exports: [SubscriberService, SubscriberRepository],
})
export class SubscriberModule {}
