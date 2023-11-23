import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1', { exclude: [] });

  // Swagger configuration
  const options = new DocumentBuilder()
    .setTitle('Email Marketing Platform')
    .setDescription('Email Marketing Platform API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token in following format: bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'bearer',
        scheme: 'bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);

  const swaggerCustomOptions = {
    swaggerOptions: {
      urls: [
        {
          url: '/swagger-json',
          name: 'Swagger JSON',
        },
      ],
    },
  };
  SwaggerModule.setup('swagger', app, document, swaggerCustomOptions);

  await app.listen(3000);
}
bootstrap();
