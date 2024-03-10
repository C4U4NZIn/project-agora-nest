import { Coordenador } from "src/entities/coordenador.entity";



export interface CoordenadorToken extends Coordenador {
    access_token:string;  
}