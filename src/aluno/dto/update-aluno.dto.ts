import {
  IsString,
  IsUUID
} from 'class-validator'

export class UpdateDtoAluno {

     @IsString()
     fieldUpdate:string;
     @IsString()
     fieldName:string;

     @IsString()
     @IsUUID()
     idAluno:string;
     
}