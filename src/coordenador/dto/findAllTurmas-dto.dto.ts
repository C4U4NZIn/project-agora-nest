
import {
    IsUUID,
    IsString
} from 'class-validator'


export class AllTurmasDto{
   
    @IsString()
    @IsUUID()
    idCoordenador:string;

}