import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
//validação geral dos dados passados com o Validationpipes
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true,
    forbidNonWhitelisted:true,
  }));
  app.enableCors();
  
  await app.listen(3333);
}
bootstrap();
