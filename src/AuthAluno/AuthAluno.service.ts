import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AlunoService } from "src/aluno/aluno.service";
import { Aluno } from "src/entities/aluno.entity";
import { AlunoToken } from "./models/AlunoToken";
import { ForbiddenException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { AlunoPayload } from "./models/AlunoPayload";
@Injectable()
export class AuthAlunoService{
   constructor(
    private readonly jwtService:JwtService,
    private readonly alunoService:AlunoService
    
    ){}

    async login(user:Aluno):Promise<AlunoToken>{
        try {
          
     const payload:AlunoPayload = {
      sub:user.id,
      email:user.email,
      username:user.username
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
   async validateAluno(email: string, password: string):Promise<Aluno> {
      const user = await  this.alunoService.findByEmail(email);
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

}