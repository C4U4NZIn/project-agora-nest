import { Injectable } from "@nestjs/common";

import * as bcrypt from 'bcrypt'

import { Prisma } from '@prisma/client'

import { UserCreateDto } from "src/dto/create-user.dto";

import { PrismaService } from "src/prisma.service";
import { User } from "src/entities/user.entity";
import { throwError } from "rxjs";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";


//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class UserService{

   constructor(private readonly prisma:PrismaService){}

   //dá de fzer um try catch tlvz
   async create(userCreateDto:UserCreateDto):Promise<User>{
   
   const data:Prisma.UserCreateInput = {
      ...userCreateDto,
      password: await bcrypt.hash(userCreateDto.password,10),
   }
    const createdUser = await this.prisma.user.create({data});

      return {
         ...createdUser,
         password:undefined,
      };

   }

   //Show the profile user by email
   async findUserByEmailToShowAfterLogin(email:string):Promise<User>{
     try {
    let user = await this.prisma.user.findUnique({where:{email}});

       if(!user){
       //  console.log("The error is too bad, dude");
         return user;
       }
       else{
         return {
            ...user,
            password:undefined
         };
       }
         
     } catch (error) {
      console.log(error);
     }
   }


   // find user by email , utilized in authentication in the function validate
   async findByEmail(email:string):Promise<User>{
   
      let userByEmail =  await this.prisma.user.findUnique({where:{email}});
      return userByEmail;  
   
   }


   async updateAtributesByIdUser(userUpdateDto:UpdateUserDataDto):Promise<User>{
   
      try {
          
         const data:Prisma.UserUpdateInput = {
           
            ...userUpdateDto,
            password: await  bcrypt.hash(userUpdateDto.password,10),


         }



         let updateEmailThatReturnUserProfile = await this.prisma.user
         .update(
         {
         
            where:{
               id:userUpdateDto.id
            },
            data:{
            email:data.email
            },
            
        
         });
         
         if(!updateEmailThatReturnUserProfile)
            console.log("Something went wrong!");
             else{
               return updateEmailThatReturnUserProfile; 
             }
      } catch (error) {
         console.log(error);
      }

}






   
  //delete profile user by email 
   async deleteUserByEmail(email:string):Promise<User|null>{

    try {

      let userDeleted = this.prisma.user.delete({where:{email}});
   
      if(!userDeleted){
      console.log("Erro ao deletar perfil");
    } else{
       console.log("Sucess to delete the  profile");
      return {
         ...userDeleted,
      }
    }


    } catch (error) {
      console.log(error);
    }

   }


}