import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { LocalStrategy } from './strategies/local.strategy';



@Module({
    imports:[
        UserModule,

        PassportModule,
        
        JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn:'30d'}
        }),
    
    ],
    controllers:[AuthController],
    //são todos injectables, ou seja vão ser provedores no modulo principal
    providers:[AuthService,LocalStrategy,JwtStrategy],
})
//Chamando a implementação do middleware para validar o login
export class AuthModule{}
