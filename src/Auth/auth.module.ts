import { MiddlewareConsumer, Module, NestMiddleware, NestModule, RequestMethod } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { LocalStrategy } from './strategies/local.strategy';

//import {loggerValidationMiddleware} from '../Auth/middlewares/login-validation.middleware';


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
export class AuthModule{}
/**
 * 
configure(consumer: MiddlewareConsumer) {
    consumer 
    .apply(loggerValidationMiddleware)
    .forRoutes({path:'login',method:RequestMethod.POST});
}
*/