import { HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { ProfessorCreateDto } from "./dto/create-professor.dto";
import { Professor } from "src/entities/professor.entity";


//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class ProfessorService{
   private readonly logger = new Logger(ProfessorService.name)

   constructor(private readonly prisma:PrismaService){}

   //dá de fzer um try catch tlvz
   async create(profCreateDto:ProfessorCreateDto):Promise<Professor|string>{
 

      try {
           
      const isThereTheSameExistProfessor = await this.prisma.professor.findUnique({where:{
         email: profCreateDto.email
      }})

         
       if(!isThereTheSameExistProfessor){

         const data:Prisma.ProfessorCreateInput = {
            ...profCreateDto,
            password: await bcrypt.hash(profCreateDto.password,10),
         }
          const createdProfessor = await this.prisma.professor.create({data});
      
            return {
               ...createdProfessor,
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

   async findByEmail(email:string):Promise<Professor>{
   
    let  profByEmail =  await this.prisma.professor.findUnique({where:{email}});
    return profByEmail;  
 
 }

   //Show the profile user by email
  




}