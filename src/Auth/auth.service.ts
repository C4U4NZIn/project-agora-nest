import { ForbiddenException, Injectable } from "@nestjs/common";
import { User } from '../entities/user.entity'
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UserPayload } from "./models/UserPayload";
import { UserToken } from "./models/UserToken";
import { Professor } from "src/entities/professor.entity";
import { ProfessorService } from "src/professor/professor.service";



@Injectable()
export class AuthService{
    //instanciar o objeto userService do tipo UserService
    //instanciar o objeto jwtService 
    //o JwtService é fornecido pelo module '@nestjs/jwt'
    constructor(
   private readonly jwtService:JwtService,     
  
   private readonly profService:ProfessorService

   ){}

    //instanciarei o payload que será usado como parametro pro jwt
    //pra poder gerar o acess_token
    //Essa função Login devolverá um token de user
    async login(user:Professor):Promise<UserToken>{
        try {
          
     const payload:UserPayload = {
      sub:user.id,
      email:user.email,
      username:user.username,
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
   async validateUser(email: string, password: string, role:string):Promise<Professor> {
      const user = await  this.profService.findByEmail(email);
    
     if(user){
           
        const isValidRole = role === user.role;
        const isHashedPasswordValid = await bcrypt.compare(password,user.password);
        

       if(isHashedPasswordValid && isValidRole){
     
        return {
                ...user,
                password:undefined,
            }
     
        }
       
       
        throw new Error
        ('Email or Password is Invalid , Please check your answers.');
  
    }

   }
}