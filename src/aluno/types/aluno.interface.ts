import { Aluno } from "src/entities/aluno.entity";
import { User } from "src/entities/user.entity";

export interface AlunoAndUser{
    aluno?:Aluno;
    user?:User;
}