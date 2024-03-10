import { Aluno } from "src/entities/aluno.entity";

export interface AlunoToken extends Aluno{
    access_token:string;
}