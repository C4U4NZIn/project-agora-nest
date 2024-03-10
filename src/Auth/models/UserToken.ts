import { Professor } from "src/entities/professor.entity";




export interface UserToken extends Professor {
    access_token:string;  
}