import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CoordenadorModule } from 'src/coordenador/coordenador.module';
import { AuthCoordService } from './AuthCoordenador.service';
import { LocalCoordStrategy } from './strategies/LocalCoordenador.strategy';
import { JwtCoordStrategy } from './strategies/jwtCoordenador.strategy';
import { AuthCoordController } from './AuthCoordenador.controller';
@Module({
    imports:[
        CoordenadorModule,

        PassportModule,
        
        JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn:'30d'}
        }),
    
    ],
    controllers:[AuthCoordController],
    //são todos injectables, ou seja vão ser provedores no modulo principal
    providers:[AuthCoordService,LocalCoordStrategy,JwtCoordStrategy],
})
//Chamando a implementação do middleware para validar o login
export class AuthCoordModule{}