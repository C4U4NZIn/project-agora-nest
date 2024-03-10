import { HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { CoordenadorCreateDto } from "./dto/create-coordenador.dto";
import { Coordenador } from "src/entities/coordenador.entity";


//import { AuthService } from '../../src/Auth/auth.service';

//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class CoordenadorService{
   private readonly logger = new Logger(CoordenadorService.name)

   constructor(private readonly prisma:PrismaService){}

   //dá de fzer um try catch tlvz
   async create(coordenadorCreateDto:CoordenadorCreateDto):Promise<Coordenador|string>{
 

      try {
           
      const isThereTheSameExistCoordenador = await this.prisma.coordenador.findUnique({where:{
         email: coordenadorCreateDto.email
      }})

         
       if(!isThereTheSameExistCoordenador){

         const data:Prisma.CoordenadorCreateInput = {
            ...coordenadorCreateDto,
            password: await bcrypt.hash(coordenadorCreateDto.password,10),
         }
          const createdCoordenador = await this.prisma.coordenador.create({data});
      
            return {
               ...createdCoordenador,
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

   async findCoordenadorByEmail(email:string):Promise<Coordenador>{
   
    let  coordenadorByEmail =  await this.prisma.coordenador.findUnique({where:{email}});
    return coordenadorByEmail;  
 
 }

   //Show the profile user by email
  




}