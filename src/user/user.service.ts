import { Body, HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { UserCreateDto } from "src/dto/create-user.dto";
import { PrismaService } from "src/prisma.service";
import { User } from "src/entities/user.entity";
import { UpdateUserAll } from "src/dto/update-dto/update-user.dto";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { CoordenadorService } from "src/coordenador/coordenador.service";
import { otpDto } from "./dto/otp-dto.dto";


//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class UserService{
   private readonly logger = new Logger(UserService.name)

   constructor(
      private readonly prisma:PrismaService
      ){}

   //dá de fzer um try catch tlvz
   async create(userCreateDto:UserCreateDto):Promise<any>{
 

      try {
           
      const isThereTheSameExistUser = await this.prisma.user.findUnique({where:{
         email: userCreateDto.email
      }})

         
       if(!isThereTheSameExistUser){

      return {
         message:'nothing yet'
      }

       }else{
      
       throw new UserExistsException();

       }


      } catch (error) {
         this.logger.error(error);
         throw error;
      }

   }

   async findUserByEmail(email:string):Promise<User>{

      const user = await this.prisma.user.findUnique({where:{email}});

      return user;

   }


   async createUserOtp(idUser:string,email:string){

     
    const data:Prisma.OtpUserCreateInput = {
      id:idUser,
      email:email,
      otpCode:''
    }

     const createUserOtp = await this.prisma.otpUser.create({data});
     return createUserOtp;

   }

 
  async updateOtp(idOtp:string){

   const updateOtp = this.prisma.otpUser.update({
      where:{
         id:idOtp
      },
      data:{
         otpCode:this.createOtp()
      }
   })

   return updateOtp;


   }


   async findOtpByEmail(email:string):Promise<any>{

      const userOtp = this.prisma.otpUser.findUnique({where:{email}});
      return userOtp;

   }

   createOtp():string{
      let code = Math.floor(Math.random()*9000 + 1000);
      return code.toString();
   }

   async verifyCodeOtp(otpCurrentCode:string , idUser:string):Promise<any>{

      
      const isValidCode = await this.verifyCode(idUser , otpCurrentCode);
      const otpUserCode = await this.prisma.otpUser.findUnique({
         where:{
            id:idUser
         }
      })
    
      return {
         isValidCode:isValidCode,
         atualCode:otpUserCode.otpCode
      }
      
      
   }
   
   async verifyCode(idUser:string , currentCode:string):Promise<boolean>{
      const userOtp = await this.prisma.otpUser.findUnique({where:{
         id:idUser
      }})

      const isTheSameCode = userOtp.otpCode === currentCode;

      if(!isTheSameCode)
         return false

       return true
    

   }

 



}