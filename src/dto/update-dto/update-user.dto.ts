import { IsEmail, IsString } from "class-validator";
import { User } from "src/entities/user.entity";



export class UpdateUserAll extends User{

    @IsString()
    username?: string;

    @IsString()
    nickname?: string;
    
    @IsEmail()
    email?: string;

    @IsString()
    password?: string;
}