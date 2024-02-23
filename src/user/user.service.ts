import { HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { UserCreateDto } from "src/dto/create-user.dto";
import { PrismaService } from "src/prisma.service";
import { User } from "src/entities/user.entity";
import { UpdateUserAll } from "src/dto/update-dto/update-user.dto";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";


//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class UserService{
   private readonly logger = new Logger(UserService.name)

   constructor(private readonly prisma:PrismaService){}

   //dá de fzer um try catch tlvz
   async create(userCreateDto:UserCreateDto):Promise<User|string>{
 

      try {
           
      const isThereTheSameExistUser = await this.prisma.user.findUnique({where:{
         email: userCreateDto.email
      }})

         
       if(!isThereTheSameExistUser){

         const data:Prisma.UserCreateInput = {
            ...userCreateDto,
            password: await bcrypt.hash(userCreateDto.password,10),
         }
          const createdUser = await this.prisma.user.create({data});
      
            return {
               ...createdUser,
               password:undefined,
            };
       }else{
      
       throw new UserExistsException();

       }


      } catch (error) {
         this.logger.error(error);
         throw error;
      }

   }

   //Show the profile user by email
   async findUserByEmailToShowAfterLogin(email:string):Promise<User>{
     try {
    let user = await this.prisma.user.findUnique({where:{email}});

       if(!user){
       //  console.log("The error is too bad, dude");
       //console.log(user);
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


   /**
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
    * 
    * 
   */
   //update Name
    async updateUserById(id:number,data:UpdateUserAll):Promise<User>{
     try {
      let updatedUserNameById = this.prisma.user.update(
         {
            where: {
            id:Number(id)
            },
            data:{
           username:data.username,
           nickname:data.nickname,
           email:data.email,
           password: await bcrypt.hash(data.password,10)
            },
         }
      );

      if(!updatedUserNameById)
      console.log(updatedUserNameById)
     else{
      return updatedUserNameById;
     }



     } catch (error) {
      console.log(error);
     }
    }

  //Update Email 

  async updateUserEmailById(id:number,email:string):Promise<User>{

     try {
      
     let updatedUserEmailById = await this.prisma.user.update(
      
      {
         where:{
         id:Number(id)
         },
         data:{
          email:String(email)
         }
      }
     );
       
     if(!updatedUserEmailById)
     console.log(updatedUserEmailById)
     else{
      return updatedUserEmailById;
     }

     } catch (error) {
      console.log(error);
     }

  }


   
  //delete profile user by id
   async deleteUserById(id:number):Promise<User|null>{

    try {

      let userDeleted = this.prisma.user.delete({where:{id}});
   
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