import { User } from "src/entities/user.entity";




export interface UserToken extends User{
    access_token:string;  
}