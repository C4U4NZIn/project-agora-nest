import { User } from "./userTest.entity";

export class Professor extends User{
   cpf?:string;
   titulacao:string;
   email_profissional:string;
   telefone1:string;
   telefone2:string;
   endereco:string;
   subject:string;
}