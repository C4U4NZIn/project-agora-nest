import { Coordenador } from "src/entities/coordenador.entity"
import { User } from "src/entities/user.entity"
export interface CoordenadorAndUser{
   coordenador?:Coordenador;
   user?:User;
}