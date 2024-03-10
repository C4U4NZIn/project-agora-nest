import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthAlunoController } from './AuthAluno.controller';
import { AuthAlunoService } from './AuthAluno.service';
import { JwtAlunoStrategy } from './stratagies/jwtAluno.strategy';
import { LocalAlunoStrategy } from './stratagies/LocalAluno.strategy';
import { AlunoModule } from 'src/aluno/aluno.module';



@Module({
    imports:[
        AlunoModule,

        PassportModule,
        
        JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn:'30d'}
        }),
    
    ],
    controllers:[AuthAlunoController],
    //são todos injectables, ou seja vão ser provedores no modulo principal
    providers:[AuthAlunoService,LocalAlunoStrategy,JwtAlunoStrategy],
})
//Chamando a implementação do middleware para validar o login
export class AuthAlunoModule{}
