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
import { FiliacaoService } from "src/filiacao/filiacao.service";
import { UpdateDtoAluno } from "./dto/update-aluno.dto";
import { UpdateAvatarDto } from "./dto/update-avatar.dto";
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
         select:{
            address:true,
            filiacao:true
         }
         
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
      const filiacaoDados:Prisma.filiacaoCreateWithoutAlunoInput = {
         username:alunoCreateDto.filiacao.username,
         tipo_Relacionamento:alunoCreateDto.filiacao.tipo_Relacionamento,
         telefone1:alunoCreateDto.filiacao.telefone1,
         telefone2:alunoCreateDto.filiacao.telefone2,
      }
      const addressDados:Prisma.addressCreateWithoutAlunoInput = {
         cep:alunoCreateDto.address.cep,
         numberHouse:alunoCreateDto.address.numberHouse,
         bairro:alunoCreateDto.address.bairro,
         estado:alunoCreateDto.address.estado,
         cidade:alunoCreateDto.address.cidade,
         country:alunoCreateDto.address.country,
         logradouro:alunoCreateDto.address.logradouro,
         complemento:alunoCreateDto.address.complemento,
         professor:{},
         coordenador:{}
       }

      const data:Prisma.AlunoCreateInput = {
         username:alunoCreateDto.username,
         email:alunoCreateDto.email,
         role:alunoCreateDto.role,
         emailInstitutional:alunoCreateDto.emailInstitutional,
         matricula:alunoCreateDto.matricula,
         turma:alunoCreateDto.turma,
         password: await bcrypt.hash(alunoCreateDto.password,10),
         filiacao:{
            create:filiacaoDados
         },
         address:{
            create:addressDados
         }
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
      },
      include:{
        address:true,
        filiacao:true
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
         console.log("aluno id=>",idAluno);
         console.log("fieldName=>",fieldName);
         console.log("fieldUpdate=>",fieldUpdate);

         

         console.log("updatedAluno=>",updatedAluno);
         return updatedAluno;
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


}
