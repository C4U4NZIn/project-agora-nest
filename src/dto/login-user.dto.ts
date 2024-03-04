import { User } from '../entities/user.entity'

import {
    IsString,
    IsEmail,
} from 'class-validator';

export class UserDataAfterLogin extends User{

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role:string;


}