import { Body, HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { CoordenadorCreateDto } from "./dto/create-coordenador.dto";
import { Coordenador } from "src/entities/coordenador.entity";
import { User } from "src/entities/user.entity";
import { CoordenadorAndUser } from "./types/coordenador.interface";
import { UserService } from "src/user/user.service";
import { CreateTurmaDto } from "./dto/create-turma.dto";
import { CreateSala } from "./dto/create-sala.dto";
import { SalasAlunosDto } from "./dto/create-alunoSalas.dto";
import { UpdateCoordenadorDto } from "./dto/update-coordenador.dto";
import { GetAllSalasDto } from "./dto/getAllSalas.dto";


//import { AuthService } from '../../src/Auth/auth.service';
//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class CoordenadorService{
   
   private readonly logger = new Logger(CoordenadorService.name)
   constructor(
     private readonly prisma:PrismaService,
     private readonly user:UserService
   ){}

   async create(coordenadorCreateDto:CoordenadorCreateDto):Promise<CoordenadorAndUser|any>{

      try {
           
       const verifiedCoordenador = await this.exists(coordenadorCreateDto.email);
       if(!verifiedCoordenador){
        const createdCoordenador = await this.createCoordenador(coordenadorCreateDto); 
        const createdUser = await this.createUser(createdCoordenador);
        const coordenadorAddress = await this.prisma.coordenador.findUnique({
         where:{
          id:createdCoordenador.id
         },
         select:{
            address:true,
         }
        })

      return {
      coordenador:createdCoordenador,
      user:createdUser,
      ...coordenadorAddress

      }

       }else{
      
       throw new UserExistsException();

       }

      } catch (error) {
         this.logger.error(error);
         throw error; 
      }
}
   async createCoordenador(coordenadorCreateDto:CoordenadorCreateDto):Promise<Coordenador|null>{
         const addressDados:Prisma.addressCreateWithoutCoordenadorInput = {
      cep:coordenadorCreateDto.address.cep,
      numberHouse:coordenadorCreateDto.address.numberHouse,
      bairro:coordenadorCreateDto.address.bairro,
      estado:coordenadorCreateDto.address.estado,
      cidade:coordenadorCreateDto.address.cidade,
      country:coordenadorCreateDto.address.country,
      logradouro:coordenadorCreateDto.address.logradouro,
      complemento:coordenadorCreateDto.address.complemento,
      aluno:{},
      professor:{}
     }
      const data:Prisma.CoordenadorCreateInput = {
         ...coordenadorCreateDto,
         password: await bcrypt.hash(coordenadorCreateDto.password,10),
         address:{
            create:addressDados
         }
      }
      const createdCoordenador = await this.prisma.coordenador.create({data});
      return createdCoordenador;
      
   }
   async exists(email:string):Promise<boolean>{
      const isThereTheSameCoordenator = await this.prisma.coordenador.findUnique({where:{email}});
      
      if(isThereTheSameCoordenator){
         return true
      }else{
         return false
      }
      
      
   }
   async createUser(createdCoordenador:Coordenador):Promise<User|any>{
      
      const data:Prisma.UserCreateInput = {
         id:createdCoordenador.id,
         email:createdCoordenador.email,
         password:createdCoordenador.password,
         role:createdCoordenador.role,
         
      }
      const createdUser = await this.prisma.user.create({data});
      const createdOtpUser = await this.user.createUserOtp(createdUser.id,createdUser.email);
      
      
      return {
         user: createdUser,
         otpUser:createdOtpUser,
      };
      
   }
   //Show the profile user by email
   async findCoordenadorByEmail(email:string):Promise<Coordenador>{
   
    let  coordenadorByEmail =  await this.prisma.coordenador.findUnique({where:{email}});
    return coordenadorByEmail;  
   
   }
   async findCoordenadorById(id:string):Promise<Coordenador|null>{
      const coordenador = await this.prisma.coordenador.findUnique({
         where:{
            id:id
         },
         include:{
            address:true
         }
      });
      return coordenador;
   }

  async createTurma(createTurmaDto:CreateTurmaDto):Promise<any>{

     const data:Prisma.TurmasCreateInput = {
      ...createTurmaDto
     }

     const createdTurmaByCoordenador = await this.prisma.turmas.create({data});
     const TurmasByCoordenador = await this.prisma.coordenador.findUnique({
      where:{
         id:createTurmaDto.idCoordenador
      },
      select:{
         turmas:true
      }
     })

     return {
      Turma:createdTurmaByCoordenador,
      ...TurmasByCoordenador
     }

  }

  async findAllTurmas(idCoordenador:string):Promise<any>{

   const findAllByIdCoordenador = await this.prisma.coordenador.findMany({where:{
      id:idCoordenador
   },
   select:{
      turmas:true
   }
})
    
return findAllByIdCoordenador


  }
  async createSala(createSalaDto:CreateSala):Promise<any>{


       const turmaDados:Prisma.TurmasFindUniqueArgs = {
         where:{
            id:createSalaDto.idTurma
         }
       }

       const professorDados:Prisma.ProfessorFindUniqueArgs = {
           where:{
            id:createSalaDto.idProfessor
           }
       }
       
       const findProfessor = await this.prisma.professor.findUnique(professorDados);
       const findTurma = await this.prisma.turmas.findUnique(turmaDados);
       



      const data:Prisma.SalasCreateInput = {
          name:createSalaDto.name,
          avatar:createSalaDto.avatar,
         turma:{
            connect:findTurma
         },
         professor:{
            connect:findProfessor
         },
         
      }
      const createdSala = await this.prisma.salas.create({data});

      const findProfessor2 = await this.prisma.salas.findUnique({
         where:{
            id:createdSala.id
         },
         select:{
            professor:true
         }
      })



      return {

       sala:createdSala,
       professorAssocieted:findProfessor2

      }





  }
  async createAlunoInSalas(createSalasAlunos:SalasAlunosDto):Promise<any>{

   const salaDados:Prisma.SalasFindUniqueArgs = {
       where:{
         id:createSalasAlunos.idSala
       }
   }

    const alunoDados:Prisma.AlunoFindUniqueArgs = {
      where:{
       id:createSalasAlunos.idAluno
      },

    }
 

   const findAlunos = await this.prisma.aluno.findUnique(alunoDados)
   const findSalaByAluno = await this.prisma.salas.findUnique(salaDados);


   const data:Prisma.Salas_AlunosCreateInput = {
     sala:{
      connect:findSalaByAluno
     },
     aluno:{
      connect:findAlunos
     }
   }

    const createdSalaAlunos = await this.prisma.salas_Alunos.create({data});
    const findSalasAlunos:Prisma.Salas_AlunosFindManyArgs = {
       where:{
         idSala:createdSalaAlunos.idSala
       },
       select:{
         aluno:true
       }
   }

    const findAlunosBySala = await this.prisma.salas_Alunos.findMany(findSalasAlunos);

    return {
      AllAlunos:findAlunosBySala,
      SalaCriada:createdSalaAlunos
    }


  }
  // essa função não vai mudar 
  async updateCoordenadorByParcialField({fieldUpdate , fieldName , idCoordenador}:UpdateCoordenadorDto):Promise<any>{

   let updatedCoordenador;

    switch(fieldName){
      case 'email':
       updatedCoordenador = await  this.prisma.coordenador.update({
         where:{
            id:idCoordenador
         },
         data:{
            email:fieldUpdate
         }
       })
       break;
      case 'telefone':
      updatedCoordenador = await this.prisma.coordenador.update({
         where:{
            id:idCoordenador
         },
         data:{
            phonePersonal:fieldUpdate
         }
      })
      break;
      case  'password':
         updatedCoordenador = await  this.prisma.coordenador.update({
            where:{
               id:idCoordenador
            },
            data:{
               password:fieldUpdate
            }
         })
         break;
         
      }

      //debug de código
      console.log("aluno id=>",idCoordenador);
      console.log("fieldName=>",fieldName);
      console.log("fieldUpdate=>",fieldUpdate);

      

      console.log("updatedAluno=>",updatedCoordenador);
      return updatedCoordenador;
}

async deleteCoordenadorById(id:string):Promise<any>{
  try {
     
    id = id.startsWith(':') ? id.slice(1) : id;

     const excludedCoordenador = this.prisma.coordenador.delete({
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
         excludedCoordenador
      }

      
      
         
  } catch (error) {
   throw new Error(`${error}`)
  }

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
         salaName:salas_alunos.sala.name,
         salaAvatar:salas_alunos.sala.avatar,
         idProfessor:salas_alunos.sala.idProfessor
      }
   })
 
    console.log("É pra ter um array com todas as salas=>",getClassOneforOne);
   

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
         salaName:sala.salaName,
         professorName:professor.username,
         salaAvatar:sala.salaAvatar,
         professorAvatar:professor.avatar
        }
    })
 
    console.log(result);


    return {
      ...result
    }


   }

  

}
 