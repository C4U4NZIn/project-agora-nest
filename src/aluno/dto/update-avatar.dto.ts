import {
  IsBase64, 
  IsString,
  IsUUID,

} from 'class-validator'
import { isArrayBuffer } from 'util/types';



export class UpdateAvatarDto{
  
    @IsBase64()
    avatar:Buffer;
    
    @IsString()
    @IsUUID()
    alunoId:string;


}