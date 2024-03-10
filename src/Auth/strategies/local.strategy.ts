import { Injectable, Req, Request } from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';

import { AuthRequest } from '../models/authRequest';

@Injectable()
 export class LocalStrategy extends PassportStrategy(Strategy , 'local') {
  constructor(private authService: AuthService) {
    super({ 
      usernameField: 'email',
      passReqToCallback:true 
  
  });
  }
  


  validate(@Request() req:AuthRequest , email: string, password: string ){
   const role = req.body.role;
    return this.authService.validateUser(email, password, role);
  }

}