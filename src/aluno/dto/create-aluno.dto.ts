import {
    IsEmail,
    IsString,
    Matches,
    MinLength,
    MaxLength
  
  }  from 'class-validator'
import { Aluno } from 'src/entities/aluno.entity';

export class AlunoCreateDto extends Aluno {
  
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
     nickname:string;
    
     @IsString()
     role:string;
  
  }