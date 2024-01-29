import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,  } from "@nestjs/common";

import { Request } from "express";

import { UserService } from '../user/user.service'

import { UserCreateDto } from '../dto/create-user.dto'

import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { UserDataAfterLogin } from "src/dto/login-user.dto";



@IsPublic()
@Controller('user')
export class UserController{
    constructor(private readonly userService:UserService){}

    @Post('post')
    create(@Body() userCreateDto:UserCreateDto){
     return this.userService.create(userCreateDto);
    }
    
    @Post('read')
    findUserByEmailToShowAfterLogin(@Body() userDataAfterLogin:UserDataAfterLogin){
        return this.userService.findByEmail(userDataAfterLogin.email);
    }

  

  
    @Delete('delete')
    deleteUserByEmail(@Body() userDataAfterLogin:UserDataAfterLogin){
     return  this.userService.deleteUserByEmail(userDataAfterLogin.email);
    }

}