import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsOptional,
  IsBase64,
  ValidateNested

}  from 'class-validator'
import { Professor } from 'src/entities/professor.entity';
import { addressDto } from 'src/dto/address-dto.dto';
import { Type } from 'class-transformer';
export class ProfessorCreateDto extends Professor {

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
 telefone1: string;

 @IsString()
 @IsPhoneNumber('BR')
 telefone2: string;


 @IsString()
 cpf?: string;

 @IsString()
 titulacao: string;

 @ValidateNested()
 @Type(()=>addressDto)
 address:addressDto;


}