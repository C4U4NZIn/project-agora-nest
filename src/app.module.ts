import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';

import { PrismaModule } from './prisma.module';

import { AuthModule } from './Auth/auth.module';

import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './Auth/guards/jwt-auth.guard';

import { MailerModule } from '@nestjs-modules/mailer';

import { EmailController } from './email/mail.controller';



@Module({
  imports: [
    MailerModule.forRoot(
      {
        transport:{
          host:'smtp.sendgrid.net',
          auth:{
            user:'apikey',
            pass:'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'
          }
        }
      }
    ),
    
    
    PrismaModule , UserModule , AuthModule],
    controllers:[EmailController],
  providers:[
    {
      provide:APP_GUARD,
      useClass:JwtAuthGuard,
    }
  ]
})
export class AppModule {}

