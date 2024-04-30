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


export class CreateTurmaDto{

    @IsString()
    @IsUUID()
   idCoordenador:string;

   @IsString()
   name:string;

}