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
    IsPhoneNumber,
    IsArray,

  
  }  from 'class-validator'

  import {
     Type
  } from 'class-transformer'




class alunoId{
  @IsUUID()
  @IsString()
  alunoId:string;
}


  //depois adaptar a lógica para poder criar vários professores
export class CreateSala{

    @IsString()
    sala_name:string;
    
    @IsUUID()
    @IsString()
    turmaId:string;

    @IsString()
    @IsUUID()
    professorId:string;

    @IsString()
    @IsUUID()
    coordenadorId:string;

    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>alunoId)
    alunosId:alunoId[]   
   
    
  }

export class DeleteSala_AlunosDto{
  
  @IsUUID()
  @IsString()
  alunoId:string;
  @IsUUID()
  @IsString()
  salaId:string;
}