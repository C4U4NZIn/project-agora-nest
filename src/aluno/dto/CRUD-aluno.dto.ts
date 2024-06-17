import {
    IsBase64, 
    IsEmail,
    IsString,
    Matches,
    MinLength,
    MaxLength,
    ValidateNested,
    IsOptional,
    IsUUID,
    IsPhoneNumber
  
  } from 'class-validator';
import { Aluno } from 'src/entities/aluno.entity';

  
 export class AlunoCreateDto extends Aluno{
      
  @IsEmail()
  email: string;

  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,{
   message: 'Senha muito fraca , tente outra!'
  })
  @MinLength(8)    
  @MaxLength(18)
  password: string;

  @IsString()
  username:string;
 
  @IsString()
  role:string;

  @IsString()
  @IsPhoneNumber('BR')
  telefone?: string;


 @IsString()
 matricula: string;
 @IsString()
 turma: string;
 
 @IsString()
 parent_name: string;

 @IsString()
 @IsPhoneNumber('BR')
 telefone_parent_1: string;

 @IsString()
 @IsPhoneNumber('BR')
 telefone_parent_2: string;


  }

  export class UpdateDtoAluno {

    @IsString()
    fieldUpdate:string;
    @IsString()
    fieldName:string;

    @IsString()
    @IsUUID()
    idAluno:string;
    
}

  export class UpdateAvatarDto{
    
      @IsBase64()
      avatar:Buffer;
      
      @IsString()
      @IsUUID()
      alunoId:string;
  }
