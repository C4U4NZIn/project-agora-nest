import {
 IsString,
 IsUUID
 } from 'class-validator'

export class UpdateCoordenadorAvatar{
    avatar:Buffer;

    @IsString()
    @IsUUID()
    coordenadorId:string;
}