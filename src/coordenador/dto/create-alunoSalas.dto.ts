import {

 IsUUID,
 IsString,
 IsArray,
 ValidateNested


} from 'class-validator'
import {
  Type
} from 'class-transformer'


//puxar a classe alunoId depois

export class AlunoId{
    @IsUUID()
    @IsString()
    alunoId:string;
}


export class SalasAlunosDto{

    
    @IsUUID()
    @IsString()
    salaId:string;
        
    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>AlunoId)
    alunosId:AlunoId[]
  


}