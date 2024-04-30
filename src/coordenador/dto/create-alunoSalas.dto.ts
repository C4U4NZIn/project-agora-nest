import {

 IsUUID,
 IsString


} from 'class-validator'



export class SalasAlunosDto{

    
    @IsUUID()
    @IsString()
    idSala:string;
        
    @IsUUID()
    @IsString()
    idAluno:string;
  


}