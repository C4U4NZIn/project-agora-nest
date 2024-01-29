import { Request } from 'express';

import { User } from '../../entities/user.entity'
//Basicamente , foi aqlo que eu expliquei
//o objeto authRequest é do tipo AuthRequest que extende ou pega as
//propriedades da classe pai Request do express, como se fosse uma requisição
//Mas ela possui uma tipagem como objeto user da classe User, basicamente.
export interface AuthRequest extends Request{
    user:User
}