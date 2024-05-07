import { IsString, IsUUID } from "class-validator";

export class GetAllSalasDto{
     @IsString()
     @IsUUID()
    alunoId:string;
}