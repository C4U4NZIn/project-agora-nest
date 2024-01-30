import { User } from "src/entities/user.entity";

import { IsEmail } from "class-validator";

export class UpdateUserEmail extends User{
    
    @IsEmail()
    email: string;
}