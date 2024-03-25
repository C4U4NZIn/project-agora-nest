import { HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { AlunoCreateDto } from "./dto/create-aluno.dto";
import { Aluno } from "src/entities/aluno.entity";



//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class AlunoService{
   private readonly logger = new Logger(AlunoService.name)

   constructor(private readonly prisma:PrismaService){}

   //dá de fzer um try catch tlvz
   async create(alunoCreateDto:AlunoCreateDto):Promise<Aluno|string>{
 

      try {
           
      const isThereTheSameExistAluno = await this.prisma.aluno.findUnique({where:{
         email: alunoCreateDto.email
      }})

         
       if(!isThereTheSameExistAluno){

         const data:Prisma.AlunoCreateInput = {
            ...alunoCreateDto,
            password: await bcrypt.hash(alunoCreateDto.password,10),
         }
          const createdAluno = await this.prisma.aluno.create({data});
      
            return {
               ...createdAluno,
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

  async findAlunoById(id:string){
     return this.prisma.aluno.findUnique({
      where:{id}
     })
  }
   //Show the profile user by email
  


   async findAlunoByEmail(email:string):Promise<Aluno>{
   
      let  alunoByEmail =  await this.prisma.aluno.findUnique({where:{email}});
      return alunoByEmail;  
   
   }
  


}