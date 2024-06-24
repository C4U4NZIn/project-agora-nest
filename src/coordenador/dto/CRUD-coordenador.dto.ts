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
export class CoordenadorCreateDto extends Coordenador {
  
    @IsEmail()
    email: string;
 
    @IsEmail()
    email_profissional: string;

    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
     message: 'Senha muito fraca , tente outra!'
    })
    @MinLength(8)    
    @MaxLength(18)
    password: string;
 
    @IsString()
    username:string;

    @IsString()
    name_instituicao: string;
   
    @IsString()
    role:string;


   @IsString()
   @IsPhoneNumber('BR')
   telefone1: string;

   @IsString()
   @IsPhoneNumber('BR')
   telefone2: string;

   @IsString()
   cep: string;

   @IsString()
   endereco: string;

   
 
 }
 export class UpdateCoordenadorDto{
    @IsString()
    fieldUpdate:string;
    @IsString()
    fieldName:string;

    @IsString()
    @IsUUID()
    idCoordenador:string;
}
export class UpdateCoordenadorAvatar{
   
    @IsBase64()
    avatar:Buffer;

    @IsString()
    @IsUUID()
    coordenadorId:string;
}