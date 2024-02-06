import { User } from "src/entities/user.entity";



export class UserUpdateDto extends User{


  email: string;

  username?: string;

  nickname?: string;

  phone?: string;

  password: string;


}