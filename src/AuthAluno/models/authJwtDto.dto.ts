import { IsJWT } from "class-validator";

export class AuthJwt {
    @IsJWT()
    jwtToken:string;
}