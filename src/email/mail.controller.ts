import { MailerService } from "@nestjs-modules/mailer";

import { Controller, Post, Query , Body , Get , Res } from "@nestjs/common";


import { IsPublic } from "../Auth/decorators/is-public.decorator";
import { UserService } from "src/user/user.service";
import { PrismaService } from "src/prisma.service";



@IsPublic()
@Controller('email')
export class EmailController{
 constructor( 
  private mailService:MailerService,
  private readonly userService:UserService,
  private readonly prismaService:PrismaService

 ){}

 
/**
 * 
 @Get('getIsThefirstOne')
 async sendEmailByPlainting(@Query('toemail') toemail){
  await this.mailService.sendMail({
    to:toemail,
    from:"cauazindofree1234@gmail.com",
    subject:"First Test to improve the code",
    text:" It was a pleasure! see you again"
  });
  return "sucess";
 }
 */

 @Post('SendEmail')
 async sendEmailtoUser(@Body() payload){

  const otpUser = await this.userService.findOtpByEmail(payload.email);
  let updatedUser;
  
  
  if(otpUser.otpCode === '' || otpUser.otpCode !== ''){
     updatedUser = await this.userService.updateOtp(otpUser.id);
}

  await this.mailService.sendMail({
    to:payload.email,
    from:"cauazindofree1234@gmail.com",
    subject:"First Test to improve the code",
    template:'superhero',
    context:{
      superHero:updatedUser.otpCode
    }
   
  });

  if(!otpUser){
    return {
      status:404,
      message:'Ops! Erro no servidor! Tente novamente mais tarde!'
    }
  }

  return {
    status:202,
    message:'requisição bem sucedida!',
    createdUserOtp:otpUser,
  }

 }

}