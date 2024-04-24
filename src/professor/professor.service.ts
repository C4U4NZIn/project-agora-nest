import { HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { ProfessorCreateDto } from "./dto/create-professor.dto";
import { Professor } from "src/entities/professor.entity";
import { User } from "src/entities/user.entity";
import { ProfessorAndUser } from "./types/professor.interface";
import { UserService } from "src/user/user.service";

//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class ProfessorService{
   
   private readonly logger = new Logger(ProfessorService.name)
   constructor(
      private readonly prisma:PrismaService,
      private readonly user:UserService
   ){}

   async create(profCreateDto:ProfessorCreateDto):Promise<ProfessorAndUser|any>{
        try {
       const verifiedProf = await this.exists(profCreateDto.email);  
       if(!verifiedProf){
       const createdProfessor = await this.createProf(profCreateDto);
       const createdUser = await this.createUser(createdProfessor);     
       const professorAddress = await this.prisma.professor.findUnique({
         where:{
         id:createdProfessor.id
         },
         select:{
            address:true,
         }
       })

           return {
              professor:createdProfessor,
              user:createdUser,
              ...professorAddress
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

      const professorAddress:Prisma.addressCreateWithoutProfessorInput = {
      ...profCreateDto.address,
      
      }
      const data:Prisma.ProfessorCreateInput = {
         ...profCreateDto,
         password: await bcrypt.hash(profCreateDto.password,10),
         address:{
            create:professorAddress
         }
      }
      const createdProf = await this.prisma.professor.create({data});
      return createdProf;
   }
   async createUser(createdProf:Professor):Promise<User|any>{
      const data:Prisma.UserCreateInput = {
         id:createdProf.id,
         email:createdProf.email,
         password:createdProf.password,
         role:createdProf.role,
         
      }
      const createdUser = await this.prisma.user.create({data});
      const createdOtpUser = await this.user.createUserOtp(createdUser.id,createdUser.email);
      return {
         user: createdUser,
         otpUser:createdOtpUser,
      };
      
   }
 
   async findByEmail(email:string):Promise<Professor>{
   
    let  profByEmail =  await this.prisma.professor.findUnique({where:{email}});
    return profByEmail;  
 
   }
   async findProfById(id:string):Promise<Professor|null>{

   const professor = await this.prisma.professor.findUnique({
      where:{
         id:id
      },
      include:{
         address:true
      }
   });
   return professor;

   }
}