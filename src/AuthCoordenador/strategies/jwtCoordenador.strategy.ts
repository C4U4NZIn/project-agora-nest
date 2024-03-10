import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { CoordenadorFromJwt } from '../models/CoordFromJwt';
import { CoordenadorPayload } from '../models/CoordPayload';

@Injectable()
 export class JwtCoordStrategy extends PassportStrategy(Strategy , 'local-coordenador') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }


 


  async validateCoordenador(payload:CoordenadorPayload): Promise<CoordenadorFromJwt> {
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      role:payload.role,
    };
  }
}