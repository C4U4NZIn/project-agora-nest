import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength

}  from 'class-validator'
import { Professor } from 'src/entities/professor.entity';

export class ProfessorCreateDto extends Professor {

   @IsEmail()
   email: string;

   @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
    message: 'password too weak'
   })
   @MinLength(8)    
   @MaxLength(15)
   password: string;

   @IsString()
   username:string;
  
   @IsString()
   role:string;

}