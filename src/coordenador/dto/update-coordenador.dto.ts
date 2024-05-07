
import {
 IsString,
 IsUUID
}  from 'class-validator'

export class UpdateCoordenadorDto{
    @IsString()
    fieldUpdate:string;
    @IsString()
    fieldName:string;

    @IsString()
    @IsUUID()
    idCoordenador:string;
}