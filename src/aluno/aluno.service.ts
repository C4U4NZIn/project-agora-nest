import { HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { AlunoCreateDto } from "./dto/CRUD-aluno.dto";
import { Aluno } from "src/entities/aluno.entity";
import { JwtService } from "@nestjs/jwt";
import { AlunoAndUser } from "./types/aluno.interface";
import { User } from "src/entities/user.entity";
import { UserService } from "src/user/user.service";
import { UpdateDtoAluno } from "./dto/CRUD-aluno.dto";
import { UpdateAvatarDto } from "./dto/CRUD-aluno.dto";
import { GetAllSalasDto } from "src/coordenador/dto/getAllSalas.dto";
//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class AlunoService{
  
   private readonly logger = new Logger(AlunoService.name)
   constructor(
      private readonly prisma:PrismaService,
      private readonly user:UserService, 
    
   ){}

   async create(alunoCreateDto:AlunoCreateDto):Promise<AlunoAndUser|any>{
 
      try {
         
      const verifiedAluno = await this.exists(alunoCreateDto.email);

      if(verifiedAluno){
         throw new UserExistsException();
      }

      const createdAluno = await this.createAluno(alunoCreateDto);
      const createdUser = await this.createUser(createdAluno);
      const alunoAddress = await this.prisma.aluno.findUnique({
         where:{
            id:createdAluno.id
         },
         
      })

      return {
         aluno:createdAluno,
         user:createdUser,
         ...alunoAddress 
 
      }
      
     } catch (error) {
         this.logger.error(error);
         throw error;
      }

   } 
   async createAluno(alunoCreateDto:AlunoCreateDto):Promise<Aluno>{

      //verificar se password existe pra hash n dar erro
      //supostamente era pra dar certo
     if(typeof alunoCreateDto.password !== 'string' || alunoCreateDto.password === ''){
       console.log("O usuário da senha que dá erro=>" , alunoCreateDto)
      throw new Error("Password tem de ser uma string válida!");
     
      }




      const data:Prisma.AlunoCreateInput = {
         username:alunoCreateDto.username,
         email:alunoCreateDto.email,
         role:alunoCreateDto.role,
         matricula:alunoCreateDto.matricula,
         turma:alunoCreateDto.turma,
         telefone:alunoCreateDto.telefone,
         telefone_parent_1:alunoCreateDto.telefone_parent_1,
         telefone_parent_2:alunoCreateDto.telefone_parent_2,
         parent_name:alunoCreateDto.parent_name,
         password: await bcrypt.hash(alunoCreateDto.password,10),

      }

      const createdAluno = await this.prisma.aluno.create({data});
      return  createdAluno;

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
      where:{
       id:id
      }
     })
  }
  async findAlunoByEmail(email:string):Promise<Aluno>{
   
      let  alunoByEmail =  await this.prisma.aluno.findUnique({where:{email}});
      return alunoByEmail;  
   
  }
  async findAllAlunos(){
    return this.prisma.aluno.findMany();
  }
  async getAllSalasByAlunoId(getAllSalasByAlunoId:GetAllSalasDto){
   const {alunoId} = getAllSalasByAlunoId;

  const getAllSalas = await this.prisma.salas_Alunos.findMany({
     where:{
        idAluno:alunoId
     },
     include:{
        sala:true
     }
  })



  const getClassOneforOne =  getAllSalas.map((salas_alunos)=>{ 
     return {
        salaId:salas_alunos.sala.id,
        salaName:salas_alunos.sala.sala_name,
        salaAvatar:salas_alunos.sala.avatar,
        idProfessor:salas_alunos.sala.professorId
     }
  })

   // era isso mesmo
   //pelo fato de ter um comportamento assincrono
   //não sabia como pegar cada professor pelo id dele que tava na sala
   // não sei se isso é escalonável
   // pega todos os professores relacionados a cada sala em que o alunoId está
   const getProfessorOneByOne = await Promise.all(getClassOneforOne.map((sala)=>{
     return this.prisma.professor.findMany({
        where:{
           id:sala.idProfessor
        },
        select:{
         username:true,
         avatar:true
        }
     })
   }))

   //agrupa as principais informações
   // avatar e nome das entidade professor e sala
   const result = getClassOneforOne.map((sala,index)=>{
       let professor = getProfessorOneByOne[index][0];
       return {
        salaId:sala.salaId,  
        salaName:sala.salaName,
        professorName:professor.username,
        salaAvatar:sala.salaAvatar,
        professorAvatar:professor.avatar
       }
   })

   return {
     ...result
   }


  }

  async updateAlunoByParcialField({fieldUpdate , fieldName , idAluno}:UpdateDtoAluno):Promise<any>{

      let fieldUpdatedPassword;
      let updatedAluno;
     // let fieldNameTotal = fieldName.toLowerCase();
       switch(fieldName){
         case 'email':
          updatedAluno = await  this.prisma.aluno.update({
            where:{
               id:idAluno
            },
            data:{
               email:fieldUpdate
            }
          })
          break;
         case 'telefone':
         updatedAluno = await this.prisma.aluno.update({
            where:{
               id:idAluno
            },
            data:{
               telefone:fieldUpdate
            }
         })
         break;
         case  'senha':
           fieldUpdatedPassword = await bcrypt.hash(fieldUpdate,10);
            updatedAluno = await  this.prisma.aluno.update({
               where:{
                  id:idAluno
               },
               data:{
                  password:fieldUpdatedPassword
               }
            })
            break;
            
         }
         return updatedAluno;
  }
  async updateAlunoAvatar(updateAvatar:UpdateAvatarDto):Promise<{
     message:string , avatar:any
   }>{
      
      //const bufferAluno = Buffer.from(updateAvatar.avatar);
      
      const updatedAluno = await this.prisma.aluno.update({
         where:{
            id:updateAvatar.alunoId
         },
         data:{
            avatar:updateAvatar.avatar
         }
      })
      
      
      if(updatedAluno){
         return{
            message:'Requisição realizado com Sucesso!',
            avatar:updatedAluno.avatar
         }
      }else{
         return{
            message:'Requisição não realizada com sucesso',
            avatar:null
         }
      }
      
      
   }
  async deleteAlunoById(id:string):Promise<any>{
        try {
           
          id = id.startsWith(':') ? id.slice(1) : id;
   
           const excludedAluno = this.prisma.aluno.delete({
               where:{
                  id:id
               },
               
            })
          const excludeOtpUser = this.prisma.otpUser.delete({
            where:{
               id:id
            }
          });
          const excludeUser = this.prisma.user.delete({
            where:{
               id:id
            }
          })
   
          
   
          console.log("id Válido?=>",id);
   
            return {
               excludeOtpUser,
               excludeUser,
               excludedAluno
            }
   
            
            
               
        } catch (error) {
         throw new Error(`${error}`)
      }
   }

   
   
}
