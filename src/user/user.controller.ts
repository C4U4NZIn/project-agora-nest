import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put  } from "@nestjs/common";
import { Request, Response, response } from "express";
import { UserService } from '../user/user.service'
import { UserCreateDto } from '../dto/create-user.dto'
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { UserDataAfterLogin } from "src/dto/login-user.dto";
import { UpdateUserAll } from "src/dto/update-dto/update-user.dto";
import { UpdateUserEmail } from "src/dto/update-dto/update-user-email.dto";
import { Roles } from "src/roles/decorators/roles.decorator";
import { Role } from "src/roles/enums/role.enum";
import { otpDto } from "./dto/otp-dto.dto";


@IsPublic()
@Controller('user')
export class UserController{
    constructor(private readonly userService:UserService){}

    @Post('post')
    async create(@Body() userCreateDto:UserCreateDto , @Res() res:Response){

     const createdUserServiceOrHandleExceptionError = await this.userService.create(userCreateDto);
    
     return res.json({
      message:'Requisition sucesfully',
      createdUserServiceOrHandleExceptionError: createdUserServiceOrHandleExceptionError        
     })

    }

    @Post('verify')
    async verifyCode(@Body() otpUser:otpDto , @Res() res:Response){

     const isValidCode = await this.userService.verifyCodeOtp(otpUser.currentCode , otpUser.id);


     if(!isValidCode){

         res.json({
            status:409,
            message:'Ops! Ocorreu um erro no servidor! Tente novamente mais tarde!',
            isValidCode:isValidCode 
        })             
     }
     res.json({
        status:202,
        message:'Requisição bem sucedida!',
        isValidCode:isValidCode
     })    

    

    }

}