import {
    IsEmail,
    IsString,
    Matches,
    MinLength,
    MaxLength,
    IsPhoneNumber,
    IsOptional,
    IsBase64,
    ValidateNested,
    IsUUID
  
  }  from 'class-validator'
  import { Professor } from 'src/entities/professor.entity';
  export class ProfessorCreateDto extends Professor {

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
    role:string;

  
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
  
   @IsString()
   subject:string;

   @IsString()
   endereco: string;
  
  
  }
 export class UpdateProfessorDto{
    @IsString()
    fieldUpdate:string;
    @IsString()
    fieldName:string;

    @IsString()
    @IsUUID()
    idProfessor:string;
}
 export class UpdateProfessorAvatarDto{
 
 
      @IsBase64()
      avatar:Buffer;
 
     @IsString()
     @IsUUID()
     professorId:string;
 }