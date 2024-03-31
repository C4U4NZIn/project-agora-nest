import { HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { UserCreateDto } from "src/dto/create-user.dto";
import { PrismaService } from "src/prisma.service";
import { User } from "src/entities/user.entity";
import { UpdateUserAll } from "src/dto/update-dto/update-user.dto";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { CoordenadorService } from "src/coordenador/coordenador.service";


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





 



}