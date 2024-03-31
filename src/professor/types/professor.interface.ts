import { Professor } from "src/entities/professor.entity";
import { User } from "src/entities/user.entity";

export interface ProfessorAndUser{
    professor?:Professor;
    user?:User;
}