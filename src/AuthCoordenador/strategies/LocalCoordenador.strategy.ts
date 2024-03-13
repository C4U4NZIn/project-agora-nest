import { Injectable, Request } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthCoordService } from '../AuthCoordenador.service';
import { AuthCoord } from '../models/AuthCoordReques';


@Injectable()
 export class LocalCoordStrategy extends PassportStrategy(Strategy , 'local-coordenador') {
  constructor(private authCoordService: AuthCoordService) {
    super(
    {
         usernameField: 'email'
    } ,
        
    );
  }
  


  validate(email:string , password: string) {

    return this.authCoordService.validateCoordenador(email, password);
  }

}