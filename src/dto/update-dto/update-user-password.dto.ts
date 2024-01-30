import { IsString } from "class-validator";
import { User } from "src/entities/user.entity";



export class UpdateUserPassword extends User{

    @IsString()
    password: string;
}