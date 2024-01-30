import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put  } from "@nestjs/common";

import { Request } from "express";

import { UserService } from '../user/user.service'

import { UserCreateDto } from '../dto/create-user.dto'

import { IsPublic } from '../Auth/decorators/is-public.decorator';

import { UserDataAfterLogin } from "src/dto/login-user.dto";

import { UpdateUserAll } from "src/dto/update-dto/update-user.dto";
import { UpdateUserEmail } from "src/dto/update-dto/update-user-email.dto";



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

    @Put(':id')
    updateUserById(@Param('id') id:number, @Body() updateUser:UpdateUserAll){
        return this.userService.updateUserById(id,updateUser);
    }

    @Put(':id')
    updateUserEmailById(@Param('id') id:number, @Body() updateUserEmail:UpdateUserEmail){
        return this.userService.updateUserEmailById(id,updateUserEmail.email);
    }


    @Delete(':id')
     deleteUserById(@Param('id') id:number){
   
       return this.userService.deleteUserById(id);
   
    }

}