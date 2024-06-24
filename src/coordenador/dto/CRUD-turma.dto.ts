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
  import {
    Type
  } from 'class-transformer'
import { AlunoId } from './create-alunoSalas.dto';

export class CreateTurmaDto{

    @IsString()
    @IsUUID()
    idCoordenador:string;

    @IsString()
    turma_name:string;


    @ValidateNested({each:true})
    @Type(()=> AlunoId)
    alunosId:AlunoId[]


}

export class CreateStudentsInTurmaDto{


    @IsUUID()
    @IsString()
    turmaId:string;

    @ValidateNested({each:true})
    @Type(()=> AlunoId)
    alunosId:AlunoId[]
}




export class DeleteTurmaDto{
    @IsUUID()
    @IsString()
    coordenadorId:string;
   
    @IsUUID()
    @IsString()
    turmaId?:string;

    @IsString()
    @MinLength(8)
    @MaxLength(18)
    coordenadorPassword?:string;

}