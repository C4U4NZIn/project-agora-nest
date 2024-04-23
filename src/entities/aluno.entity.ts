import { filiacaoDto } from "src/dto/filiacao-dto.dto";
import { User } from "./userTest.entity";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";



export class Aluno extends User{ 
   matricula:string;
   turma:string;
   idFiliacao?:string;

}