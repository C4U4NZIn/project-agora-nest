import { HttpException , HttpStatus } from "@nestjs/common";

export class UserExistsException extends HttpException{
    constructor(){
        super('Você não pode criar um usuário já existente',HttpStatus.CONFLICT)
    }
}