import { Injectable, Request } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

import { AuthAlunoService } from '../AuthAluno.service';
import { AuthAluno } from '../models/AuthAlunoRequest';


@Injectable()
 export class LocalAlunoStrategy extends PassportStrategy(Strategy , 'local-aluno') {
  constructor(private authAlunoService: AuthAlunoService) {
    super(
    {
         usernameField: 'email',
         passReqToCallback:true 
    } ,
        
    );
  }
  


  validate(email:string , password: string) {
    return this.authAlunoService.validateAluno(email, password);
  }

}