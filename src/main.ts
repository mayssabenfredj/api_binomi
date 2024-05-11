import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const corsOptions = {
    origin: '*',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'X-Custom-Header, Content-Type, Authorization',
  };
  app.enableCors(corsOptions);

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
