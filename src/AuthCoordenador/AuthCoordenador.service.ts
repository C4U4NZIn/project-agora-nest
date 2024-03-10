import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ForbiddenException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { Coordenador } from "src/entities/coordenador.entity";
import { CoordenadorToken } from "./models/CoordToken";
import { CoordenadorService } from "src/coordenador/coordenador.service";
import { CoordenadorPayload } from "./models/CoordPayload";
@Injectable()
export class AuthCoordService{
   constructor(
    private readonly jwtService:JwtService,
    private readonly coordService:CoordenadorService
    
    ){}

    async login(user:Coordenador):Promise<CoordenadorToken>{
        try {
          
     const payload:CoordenadorPayload = {
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
   async validateCoordenador(email: string, password: string , role:string):Promise<Coordenador> {
      const user = await  this.coordService.findCoordenadorByEmail(email);
      const isValidRole = role === user.role;
     if(user && isValidRole){
           
          
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