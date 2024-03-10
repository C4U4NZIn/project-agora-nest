export interface AlunoPayload{
    
    sub:string;
    email:string;
    username:string;
    role:string;
    iat?:number;
    exp?:number;


}