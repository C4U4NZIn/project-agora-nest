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
    @Roles(Role.Student)
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