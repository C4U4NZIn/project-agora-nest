import { MailerService } from "@nestjs-modules/mailer";

import { Controller, Post, Query , Body , Get } from "@nestjs/common";


import { IsPublic } from "../Auth/decorators/is-public.decorator";



@IsPublic()
@Controller('email')
export class EmailController{
 constructor(private mailService:MailerService){}

 
/**
 * 
 @Get('getIsThefirstOne')
 async sendEmailByPlainting(@Query('toemail') toemail){
  await this.mailService.sendMail({
    to:toemail,
    from:"cauazindofree1234@gmail.com",
    subject:"First Test to improve the code",
    text:" It was a pleasure see you again"
  });
  return "sucess";
 }
 */

 @Post('SendEmail')
 async sendEmailtoUser(@Body() payload){
  await this.mailService.sendMail({
    to:payload.email,
    from:"cauazindofree1234@gmail.com",
    subject:"First Test to improve the code",
    template:'user'
  });
  return "sucess";
 }

}