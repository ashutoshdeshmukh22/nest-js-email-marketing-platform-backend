import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignModule } from './campaign/campaign.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { EmailModule } from './email/email.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtMiddleware } from './shared/middlewares/jwt.middleware';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    UserModule,
    CampaignModule,
    SubscriberModule,
    EmailModule,
    AnalyticsModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASS,
      database: process.env.DATABASE_NAME,
      port: parseInt(process.env.DATABASE_PORT),
      host: process.env.DATABASE_HOST,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');

    // consumer
    //   .apply(JwtMiddleware)
    //   .exclude(
    //     `${process.env.PREFIX}/auth/register`,
    //     `${process.env.PREFIX}/auth/login`,
    //     `${process.env.PREFIX}/auth/forgot-password`,
    //     `${process.env.PREFIX}/auth/resend-link`,
    //     `${process.env.PREFIX}/auth/reset-password`,
    //     `${process.env.PREFIX}/auth/refresh-token`,
    //     `${process.env.PREFIX}/subscriber/subscribe`,
    //     `${process.env.PREFIX}/subscriber/unsubscribe`,
    //   )
    //   .forRoutes('*');
  }
}
