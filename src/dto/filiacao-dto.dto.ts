import {
    IsEmail,
    IsString,
    Matches,
    MinLength,
    MaxLength,
    IsUUID,
    IsNumber,
    IsPhoneNumber
  
  }  from 'class-validator'
import { Filiacao } from 'src/entities/filiacao.entity';



export class filiacaoDto extends Filiacao {

   
    @IsString()
    username:string;

    @IsString()
    tipo_Relacionamento:string;

    @IsString()
    @IsPhoneNumber('BR')    
    telefone1?: string;
    
    @IsPhoneNumber('BR')
    @IsString()
    telefone2?: string;

}