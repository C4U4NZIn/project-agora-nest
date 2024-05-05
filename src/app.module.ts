import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './Auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './Auth/guards/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email/mail.controller';
import { join } from 'path';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { RolesGuard } from './roles/guards/roles.guard';
import { ProfessorModule } from './professor/professor.module';
import { CoordenadorModule } from './coordenador/coordenador.module';
import { AlunoModule } from './aluno/aluno.module';




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
        },
        template:{
          dir: join(__dirname, 'mails'),
          adapter: new HandlebarsAdapter()
        }
      }
    ),
    
    PrismaModule , AuthModule,  CoordenadorModule , AlunoModule , UserModule],
    controllers:[EmailController],
  providers:[
    {
      provide:APP_GUARD,
      useClass:JwtAuthGuard,
    },{
      provide:APP_GUARD,
      useClass:RolesGuard
    }
  ]
})
export class AppModule {}

