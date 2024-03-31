import { HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { ProfessorCreateDto } from "./dto/create-professor.dto";
import { Professor } from "src/entities/professor.entity";
import { User } from "src/entities/user.entity";
import { ProfessorAndUser } from "./types/professor.interface";

//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class ProfessorService{
   
   private readonly logger = new Logger(ProfessorService.name)
   constructor(private readonly prisma:PrismaService){}

   async create(profCreateDto:ProfessorCreateDto):Promise<ProfessorAndUser>{
 
        try {
           
       const verifiedProf = await this.exists(profCreateDto.email);
         
       if(!verifiedProf){

       const createdProfessor = await this.createProf(profCreateDto);
       const createdUser = await this.createUser(createdProfessor);     
 
           return {
              professor:createdProfessor,
              user:createdUser
            }

       }else{
      
       throw new UserExistsException();

       }


      } catch (error) {
         this.logger.error(error);
         throw error;
      }

   }


   async exists(email:string):Promise<boolean>{
      const isThereTheSameProf = await this.prisma.professor.findUnique({where:{email}});
      
      if(isThereTheSameProf){
         return true
      }else{
         return false
      }
      
   }
   
   async createProf(profCreateDto:ProfessorCreateDto):Promise<Professor|null>{
      
      const data:Prisma.ProfessorCreateInput = {
         ...profCreateDto,
         password: await bcrypt.hash(profCreateDto.password,10),
      }
      
      const createdProf = await this.prisma.professor.create({data});
      return createdProf;
      
   }

   async createUser(createdProf:Professor):Promise<User>{
      
      const data:Prisma.UserCreateInput = {
         id:createdProf.id,
         email:createdProf.email,
         password:createdProf.password,
         role:createdProf.role,
         
      }
      const createdUser = await this.prisma.user.create({data});
      
      return createdUser;
      
   }

   async findByEmail(email:string):Promise<Professor>{
   
    let  profByEmail =  await this.prisma.professor.findUnique({where:{email}});
    return profByEmail;  
 
 }

  async findProfById(id:string):Promise<Professor|null>{

   const professor = await this.prisma.professor.findUnique({where:{id}});
   return professor;

  }


}