import {

    ExecutionContext,

    Injectable,

    UnauthorizedException,

} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
  

@Injectable()
  export class LocalAlunoAuthGuard extends AuthGuard('local-aluno') {
    canActivate(context: ExecutionContext) {
      return super.canActivate(context);
    }
  
    handleRequest(err, user) {
      if (err || !user) {
        throw new UnauthorizedException(err?.message);
      }
  
      return user;
    }
  }