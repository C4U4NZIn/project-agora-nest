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

export class CreateSala{

    @IsString()
    name:string;
    
    @IsUUID()
    @IsString()
    idTurma:string;

    @IsBase64()
    avatar:Buffer;

    @IsString()
    @IsUUID()
    idProfessor:string;


    
}