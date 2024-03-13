import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AlunoPayload } from '../models/AlunoPayload';
import { Request } from 'express';
import { AlunoFromJwt } from '../models/AlunoFromJwt';

@Injectable()
 export class JwtAlunoStrategy extends PassportStrategy(Strategy , 'local-aluno') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }


 


  async validateAluno(payload: AlunoPayload): Promise<AlunoFromJwt> {
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}