import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignModule } from './campaign/campaign.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { EmailModule } from './email/email.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SubscriberModule } from './subscriber/subscriber.module';

@Module({
  imports: [
    UserModule,
    CampaignModule,
    SubscriberModule,
    EmailModule,
    AnalyticsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
