import { HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { AlunoCreateDto } from "./dto/create-aluno.dto";
import { Aluno } from "src/entities/aluno.entity";
import { JwtService } from "@nestjs/jwt";
import { AlunoAndUser } from "./types/aluno.interface";
import { User } from "src/entities/user.entity";
import { UserService } from "src/user/user.service";
import { filiacaoDto } from "src/dto/filiacao-dto.dto";

//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class AlunoService{
  
   private readonly logger = new Logger(AlunoService.name)
   constructor(
      private readonly prisma:PrismaService,
      private readonly user:UserService 
   ){}

   async create(alunoCreateDto:AlunoCreateDto):Promise<AlunoAndUser>{
 
      try {
         
      const verifiedAluno = await this.exists(alunoCreateDto.email);

      if(verifiedAluno){
         throw new UserExistsException();
      }

      const createdAluno = await this.createAluno(alunoCreateDto);
      const createdUser = await this.createUser(createdAluno);

      return {
         aluno:createdAluno,
         user:createdUser,
      }
      
     } catch (error) {
         this.logger.error(error);
         throw error;
      }

   } 
   async createAluno(alunoCreateDto:AlunoCreateDto):Promise<Aluno|null>{
      
      const data:Prisma.AlunoCreateInput = {
         username:alunoCreateDto.username,
         email:alunoCreateDto.email,
         role:alunoCreateDto.role,
         emailInstitutional:alunoCreateDto.emailInstitutional,
         matricula:alunoCreateDto.matricula,
         turma:alunoCreateDto.turma,
         password: await bcrypt.hash(alunoCreateDto.password,10),
      }
      const createdAluno = await this.prisma.aluno.create({data});

      const createdFiliacao = await this.createFiliacao(alunoCreateDto.filiacao);

      return createdAluno;
      
   }
   
   async createFiliacao(filiacao:filiacaoDto):Promise<any>{

      const dataFiliacao:Prisma.filiacaoCreateInput = {
         id:filiacao.id,
         telefone1:filiacao.telefone1,
         username:filiacao.username,
         telefone2:filiacao.telefone2,
         tipo_Relacionamento:filiacao.tipo_Relacionamento,

      }
      const createANewFiliacao = await this.prisma.filiacao.create({data:dataFiliacao})
      
      return createANewFiliacao;


   }



   async createUser(createdAluno:Aluno):Promise<User|any>{
      
      const data:Prisma.UserCreateInput = {
         id:createdAluno.id,
         email:createdAluno.email,
         password:createdAluno.password,
         role:createdAluno.role,
         
      }
      
      const createdUser = await this.prisma.user.create({data});
      
      const createdOtpUser = await this.user.createUserOtp(createdUser.id,createdUser.email);
      
      
      return {
         user: createdUser,
         otpUser:createdOtpUser,
      };
      
   }
   async exists(email:string):Promise<boolean>{
      const isThereTheSameAluno = await this.prisma.aluno.findUnique({where:{email}});
      
      if(isThereTheSameAluno){
         return true
      }else{
         return false
      }
      
   } 
  async findAlunoById(id:string){
     return this.prisma.aluno.findUnique({
      where:{id}
     })
  }
   async findAlunoByEmail(email:string):Promise<Aluno>{
   
      let  alunoByEmail =  await this.prisma.aluno.findUnique({where:{email}});
      return alunoByEmail;  
   
   }

}
