import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from '../entities/user.entity'
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UserPayload } from "./models/UserPayload";
import { UserToken } from "./models/UserToken";
import { Professor } from "src/entities/professor.entity";
import { ProfessorService } from "src/professor/professor.service";
import { Coordenador } from "src/entities/coordenador.entity";
import { Aluno } from "src/entities/aluno.entity";
import { CoordenadorService } from "src/coordenador/coordenador.service";
import { AlunoService } from "src/aluno/aluno.service";



@Injectable()
export class AuthService{
    //instanciar o objeto userService do tipo UserService
    //instanciar o objeto jwtService 
    //o JwtService é fornecido pelo module '@nestjs/jwt'
    constructor(
   private readonly jwtService:JwtService,   
   private readonly coordenadorService:CoordenadorService,
   private readonly profService:ProfessorService,
   private readonly alunoService:AlunoService,  
   private readonly userService:UserService

   ){}

    //instanciarei o payload que será usado como parametro pro jwt
    //pra poder gerar o acess_token
    //Essa função Login devolverá um token de user
    async login(user:User):Promise<UserToken>{
        try {
          
     const payload:UserPayload = {
      sub:user.id,
      email:user.email,
      role:user.role,
     }
     const jwtToken = this.jwtService.sign(payload);
     //acess_token retornado, sendo o payload dele com o email , 
     //o id e o username dele
 
     if(!jwtToken){
       throw new ForbiddenException();
     }
   
   

      return {
         access_token: jwtToken,
         ...user
      }
 
        } catch (error) {
         throw error;
        }
    }
  
    //função que valida o user[email,password] a partir do LocalStrategy 
    // que é um Injectable
    //função responsável por validar o usuário
   async validateUser(email: string, password: string):Promise<User> {
      const user = await this.userService.findUserByEmail(email);
    
     if(user){
           
      
        const isHashedPasswordValid = await bcrypt.compare(password,user.password);
        

       if(isHashedPasswordValid){
     
        return {
                ...user,
                password:undefined,
            }
     
        }
       
       
        throw new Error
        ('Email or Password is Invalid , Please check your answers.');
  
    }

   }

  async findUserBySub(token:string):Promise<any>{

   const payload = this.jwtService.decode(token);
   const userId = payload.sub;
   const role = payload.role;
   let user


   switch(role){

    case 'coordenador':
      user = await this.coordenadorService.findCoordenadorById(userId);
      break;
     
     case 'professor':
       user = await this.profService.findProfById(userId);
       break;
     case 'aluno':
     user = await this.alunoService.findAlunoById(userId);
     break;
    
    }
  
   return user;

  }



}