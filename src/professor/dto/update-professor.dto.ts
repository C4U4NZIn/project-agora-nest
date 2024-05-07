import {
 IsString,
 IsUUID
} from 'class-validator';


export class UpdateProfessorDto{
    @IsString()
    fieldUpdate:string;
    @IsString()
    fieldName:string;

    @IsString()
    @IsUUID()
    idProfessor:string;
}