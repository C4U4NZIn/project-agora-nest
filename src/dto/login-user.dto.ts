import 
{
IsEmail,
IsString
} from 'class-validator'
import { User } from 'src/entities/user.entity';


export class UserDataAfterLogin extends User{
    
    @IsEmail()
    email:string;

    @IsString()
    password:string;

}