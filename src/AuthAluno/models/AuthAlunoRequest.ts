import { Request } from "express";
import { Aluno } from "src/entities/aluno.entity";

export interface AuthAluno extends Request{
    user:Aluno
}