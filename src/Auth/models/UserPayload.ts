export interface UserPayload{ 
    sub:string;
    email:string;
    role?:string;
    iat?:number;
    exp?:number;
}