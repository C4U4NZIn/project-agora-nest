import { User } from '../entities/user.entity'

import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsUUID

}  from 'class-validator'

export class UserCreateDto extends User {


   @IsUUID()
   id?: string;

   @IsEmail()
   email: string;

   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
    message: 'password too weak'
   })
   @MinLength(8)    
   @MaxLength(15)
   password: string;

   @IsString()
   role:string;

}