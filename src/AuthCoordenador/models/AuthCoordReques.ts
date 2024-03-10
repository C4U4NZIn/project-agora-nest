import { Request } from 'express';

import { Coordenador } from '@prisma/client';
//Basicamente , foi aqlo que eu expliquei
//o objeto authRequest é do tipo AuthRequest que extende ou pega as
//propriedades da classe pai Request do express, como se fosse uma requisição
//Mas ela possui uma tipagem como objeto user da classe User, basicamente.
export interface AuthCoord extends Request{
    user: Coordenador
}