
export interface UserPayload{
    
    sub:number;
    email:string;
    username:string;
    role:string;
    iat?:number;
    exp?:number;


}