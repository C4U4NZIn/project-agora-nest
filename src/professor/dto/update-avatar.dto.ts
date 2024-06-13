import {
   IsUUID,
   IsString

} from 'class-validator'

export class UpdateProfessorAvatarDto{
    avatar:Buffer;


    @IsString()
    @IsUUID()
    professorId:string;
}