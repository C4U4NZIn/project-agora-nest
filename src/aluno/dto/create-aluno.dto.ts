import { Type } from 'class-transformer';
import {
    IsEmail,
    IsString,
    Matches,
    MinLength,
    MaxLength,
    ValidateNested,
    IsBase64,
    IsOptional,
    IsUUID
  
  }  from 'class-validator'
import { Aluno } from 'src/entities/aluno.entity';
import { addressDto } from 'src/dto/address-dto.dto';
import { filiacaoDto } from 'src/dto/filiacao-dto.dto';
import { filiacao } from '@prisma/client';

export class AlunoCreateDto extends Aluno {
  



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
 matricula: string;
 @IsString()
 turma: string;
 

  @ValidateNested()
  @Type(()=>filiacaoDto)
  filiacao:filiacaoDto;
  
}