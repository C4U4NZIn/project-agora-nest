import { User } from "./userTest.entity";



export class Aluno extends User{ 
   matricula:string;
   turma:string;
   telefone?:string;
   parent_name:string;
   telefone_parent_1:string;
   telefone_parent_2:string;

}