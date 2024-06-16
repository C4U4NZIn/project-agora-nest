import {
    IsUUID,
    IsString,
    IsBase64
 
 } from 'class-validator'
 
 export class UpdateProfessorAvatarDto{
 
 
      @IsBase64()
      avatar:Buffer;
 
     @IsString()
     @IsUUID()
     professorId:string;
 }