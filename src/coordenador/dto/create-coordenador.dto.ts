import {
    IsEmail,
    IsString,
    Matches,
    MinLength,
    MaxLength,
    IsUUID,
    ValidateNested,
    IsBase64,
    IsOptional,
    IsPhoneNumber
  
  }  from 'class-validator'
import { Coordenador } from 'src/entities/coordenador.entity';
import { addressDto } from 'src/dto/address-dto.dto';
import { Type } from 'class-transformer';
  export class CoordenadorCreateDto extends Coordenador {
  
     @IsEmail()
     email: string;
  
     @IsEmail()
     emailInstitutional: string;

     @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
      message: 'Senha muito fraca , tente outra!'
     })
     @MinLength(8)    
     @MaxLength(15)
     password: string;
  
     @IsString()
     username:string;
    
     @IsString()
     role:string;


    @IsBase64()
    @IsOptional()
    avatar?: Buffer;

    @IsString()
    @IsPhoneNumber('BR')
    phonePersonal: string;

    @IsString()
    @IsPhoneNumber('BR')
    phoneInstitutional: string;
    
  
  }