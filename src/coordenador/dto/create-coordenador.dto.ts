import {
    IsEmail,
    IsString,
    Matches,
    MinLength,
    MaxLength
  
  }  from 'class-validator'
import { Coordenador } from 'src/entities/coordenador.entity';
  
  export class CoordenadorCreateDto extends Coordenador {
  
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