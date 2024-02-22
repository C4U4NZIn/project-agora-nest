import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
//validação geral dos dados passados com o Validationpipes
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true,
    forbidNonWhitelisted:true,
  }));
  app.enableCors({
    credentials:true,
    origin:'http://localhost:3000'
  });
  app.use(cookieParser());


  await app.listen(3333);
}
bootstrap();
