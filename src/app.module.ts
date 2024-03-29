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
import { AuthAlunoModule } from './AuthAluno/AuthAluno.module';
import { AuthCoordModule } from './AuthCoordenador/AuthCoordenador.module';



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
    
    PrismaModule , AuthModule, AuthAlunoModule,AuthCoordModule, CoordenadorModule , AlunoModule],
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

