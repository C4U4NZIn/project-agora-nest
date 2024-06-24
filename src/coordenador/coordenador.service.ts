import { Body, HttpException, HttpStatus, Injectable , Logger } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import { Prisma } from '@prisma/client'
import { PrismaService } from "src/prisma.service";
import { UserExistsException } from "src/Auth/errors/user-exists.exception";
import { CoordenadorCreateDto } from "./dto/CRUD-coordenador.dto";
import { Coordenador } from "src/entities/coordenador.entity";
import { User } from "src/entities/user.entity";
import { CoordenadorAndUser } from "./types/coordenador.interface";
import { UserService } from "src/user/user.service";
import { CreateStudentsInTurmaDto, CreateTurmaDto, DeleteTurmaAlunoDto, DeleteTurmaDto } from "./dto/CRUD-turma.dto";
import { CreateSala, DeleteSala_AlunosDto } from "./dto/CRUD-sala.dto";
import { SalasAlunosDto } from "./dto/create-alunoSalas.dto";
import { UpdateCoordenadorDto } from "./dto/CRUD-coordenador.dto";
import { GetAllSalasDto } from "./dto/getAllSalas.dto";
import { UpdateCoordenadorAvatar } from "./dto/CRUD-coordenador.dto";
import { AlunoCreateDto, UpdateDtoAluno } from "src/aluno/dto/CRUD-aluno.dto";
import { AlunoService } from "src/aluno/aluno.service";
import { validate } from "class-validator";
import { createReadStream } from "fs";
import { ProfessorCreateDto, UpdateProfessorDto } from "src/professor/dto/CRUD-professor.dto";
import { ProfessorService } from "src/professor/professor.service";
import { AlunoId } from "./dto/create-alunoSalas.dto";
import { VerifyUsersExistenceService } from "./functions/coordenadorFunctions";
import { throwError } from "rxjs";

//import { AuthService } from '../../src/Auth/auth.service';
//import { loggerValidationMiddleware } from "src/Auth/middlewares/login-validation.middleware";

@Injectable()
export class CoordenadorService{
   
   private readonly logger = new Logger(CoordenadorService.name)
   constructor(
     private readonly prisma:PrismaService,
     private readonly user:UserService,
     private readonly alunoService:AlunoService,
     private readonly professorService:ProfessorService,
     private readonly verifyUsersService:VerifyUsersExistenceService
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
      
      const data:Prisma.CoordenadorCreateInput = {
         ...coordenadorCreateDto,
         password: await bcrypt.hash(coordenadorCreateDto.password,10),
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
  async createTurma(createTurmaDto:CreateTurmaDto):Promise<any>{
     try {
     const isExistAllStudents = await this.verifyUsersService.verifyAllStudentsExistence(createTurmaDto.alunosId); 
     const isExistCoordenador = await this.verifyUsersService.verifyCoordenadorExistence(createTurmaDto);
      if(isExistAllStudents.isValid && isExistCoordenador.isExistCoordenador){
         const coordenador:Prisma.CoordenadorFindUniqueArgs = {
              where:{
               id:createTurmaDto.idCoordenador
              }
         }
         const findCoordenadorById = await this.prisma.coordenador.findUnique(coordenador);
         const turmaCreateInputData:Prisma.TurmaCreateInput = {
            turma_name:createTurmaDto.turma_name,
            coordenador:{
               connect:findCoordenadorById
            }
             
           }
           const createdTurmaByCoordenador = await this.prisma.turma.create({data:turmaCreateInputData});
           //criar a turma e depois criar os alunos na turma
           const createdStudentsInTurma = await this.createStudentsInTurma({
            turmaId:createdTurmaByCoordenador.id,
            alunosId:createTurmaDto.alunosId
           })
           return {
            status:201,
            Turma:createdTurmaByCoordenador,
            AlunosInTurma:createdStudentsInTurma
           }
      }else{
         return{
            status:400
         }
      }
   
    } catch (error) {
      throw new Error(`${error}`)
     }
  }
  async createStudentsInTurma({turmaId , alunosId}:CreateStudentsInTurmaDto){
    
   const turmaInputData:Prisma.TurmaFindUniqueArgs = {
      where:{
         id:turmaId
      }
   }
   const findTurmaByAlunoData = await this.prisma.turma.findUnique(turmaInputData);
   const createdTurmaAlunos = await Promise.all(alunosId.map(async (alunoId)=>{
     const alunoCurrentInputData:Prisma.AlunoFindUniqueArgs = {
       where:{
         id:alunoId.alunoId
       }
     }

     const findCurrentAlunoData = await this.prisma.aluno.findUnique(alunoCurrentInputData);
     const inputDataTurmaAluno:Prisma.Turma_AlunosCreateInput = {
      turma:{
         connect:findTurmaByAlunoData
      },
      aluno:{
         connect:findCurrentAlunoData
      }
     }
    return await this.prisma.turma_Alunos.create({data:inputDataTurmaAluno})

   }))

   const findTurmaAlunosInputData:Prisma.Turma_AlunosFindManyArgs = {
      where:{
         idTurma:createdTurmaAlunos[0].idTurma
      },
      select:{
         aluno:true
      }
   }
    const findAlunosByTurma = await this.prisma.turma_Alunos.findMany(findTurmaAlunosInputData);


    return {
      AllAlunos:findAlunosByTurma,
      TurmaAlunosCriadas:createdTurmaAlunos
    }

  }
  async createSala(createSalaDto:CreateSala):Promise<any>{
   try {

      const isExistTeacher = await this.verifyUsersService.verifyTeacherExistenceById(createSalaDto.professorId);
      const isExistsAllStudents = await this.verifyUsersService.verifyAllStudentsExistence(createSalaDto.alunosId);


      if(isExistTeacher.isExist && isExistsAllStudents.isValid){
         
               const turmaInputSearch:Prisma.TurmaFindUniqueArgs = {
                  where:{
                     id:createSalaDto.turmaId
                  }
                }
                const teacherInputSearch:Prisma.ProfessorFindUniqueArgs = {
                    where:{
                     id:createSalaDto.professorId
                    }
                }
                const coordenadorInputSearch:Prisma.CoordenadorFindUniqueArgs = {
                   where:{
                     id:createSalaDto.coordenadorId
                   }
                }
                const coordenador = await this.prisma.coordenador.findUnique(coordenadorInputSearch);
                const teacher = await this.prisma.professor.findUnique(teacherInputSearch);
                const turma = await this.prisma.turma.findUnique(turmaInputSearch);
                const SalaDataInput:Prisma.SalasCreateInput = {
                   sala_name:createSalaDto.sala_name,
                  turma:{
                     connect:turma
                  },
                  professor:{
                     connect:teacher
                  },
                  coordenador:{
                     connect:coordenador
                  }
                  
               }
                const createdSala = await this.prisma.salas.create({data:SalaDataInput});  
                const createdAlunosSalas = await this.createAlunoInSalas(
               {
                  salaId:createdSala.id,  
                  alunosId:createSalaDto.alunosId
               })
         
               return {
                sala:createdSala,
                createdAlunosInSalas:createdAlunosSalas,
                status:201
               }

      }else{
       return {
          status:400
         }
      }

   } catch (error) {
    throw new Error(`${error}`)
   }
}
  async createAlunoInSalas({salaId , alunosId}:SalasAlunosDto):Promise<any>{
   
    const salaInputData:Prisma.SalasFindUniqueArgs = {
    where:{
       id:salaId
    }
   };
   const findSalaByAlunoData = await this.prisma.salas.findUnique(salaInputData);
   const createdSalaAlunos = await Promise.all(alunosId.map(async (alunoId:AlunoId)=>{
      
      const alunoCurrentInputData:Prisma.AlunoFindUniqueArgs = {
       where:{
        id:alunoId.alunoId
       },
     }
    const findCurrentAlunoData = await this.prisma.aluno.findUnique(alunoCurrentInputData)
    const inputDataSalasAlunos:Prisma.Salas_AlunosCreateInput = {
      sala:{
       connect:findSalaByAlunoData
      },
      aluno:{
       connect:findCurrentAlunoData
      }
    }
    
   return await this.prisma.salas_Alunos.create({data:inputDataSalasAlunos});


  })) 
  //tanto faz a posição desde que esteja na mesma sala
  const findSalasAlunos:Prisma.Salas_AlunosFindManyArgs = {
     where:{
       idSala:createdSalaAlunos[0].idSala
     },
     select:{
       aluno:true
     }
 }
   //agora fazer a mesma lógica pras questões
   //encontrar todos os alunos relacionados aquela sala
  const findAlunosBySala = await this.prisma.salas_Alunos.findMany(findSalasAlunos);


  return {
    AllAlunos:findAlunosBySala,
    SalaCriada:createdSalaAlunos
  }

}
 async findCoordenadorByEmail(email:string):Promise<Coordenador>{
   
   let  coordenadorByEmail =  await this.prisma.coordenador.findUnique({where:{email}});
   return coordenadorByEmail;  
  
  }
  async findCoordenadorById(id:string):Promise<Coordenador|null>{
     const coordenador = await this.prisma.coordenador.findUnique({
        where:{
           id:id
        },
     });
     return coordenador;
  }
  //
  async findAllTurmas(idCoordenador:string):Promise<{
   status:number;
   message?:string;
   turmas?:any
  }>{

   const findAllTurmasByIdCoordenador = await this.prisma.coordenador.findMany({where:{
      id:idCoordenador
   },
   select:{
      turmas:true
   }
})
    const turmasByIdCoordenador = Object.values(findAllTurmasByIdCoordenador[0].turmas || []).map((turma)=>{
        return{
         name_turma:turma.turma_name,
         id:turma.id  
      }})
    if(!turmasByIdCoordenador){
       return{
         status:400,
         message:'Não foi possível pegar todas as turmas do coordenador!'
       }
    }

    return{
      status:200,
      message:'Requisição realizada com sucesso!',
      turmas:turmasByIdCoordenador
    }


  }
  async getAllSalasByCoordenadorId(coordenadorId:string):Promise<{
   status:number;
   message:string;
   salas?:any[]
  }>{
      try {
         
      const coordenadorTurmas = await this.prisma.coordenador.findMany({
            where:{
               id:coordenadorId
            },
            select:{
               turmas:true
            }
         });
          //
         const salasInsideTurmas =  await Promise.all(
            Object.values(coordenadorTurmas[0].turmas || []).map(async (turma)=>{
               return await this.prisma.turma.findMany({
                  where:{
                     id:turma.id
                  },
                  select:{
                     salas:true,
                     turma_name:true
                  }
               })
            })
         )
         //just a single array with salas and details
         const salas = salasInsideTurmas.map((turmas)=>{
            return turmas.flatMap((turma)=>{
               return turma.salas.map((sala)=>{
                 return{
                  sala_name:sala.sala_name,
                  salaId:sala.id,
                  turmaName:turma.turma_name,
                  turmaId:sala.turmaId,
                  professorId:sala.professorId
                 }
               })
            })
         })

         const flattenedSalas = salas.flat();
       //devolve um array de objetos sendo cada professor relacionado a uma sala
       const professorDetailsInSalas = await Promise.all(
         flattenedSalas.map(async (sala)=>{
           const professor = await this.prisma.professor.findUnique({
            where:{
               id:sala.professorId
            }
           })

           return professor
         })
       )
        
        //aqui se torna um array com as salas , sendo cada uma possuindo
        //sala_name , salaId , turmaId , turmaName , professorId , professorName
        
      
        
        const arraySalas  = flattenedSalas.map((sala , index:number)=>{
           const professor = professorDetailsInSalas[index]
            return{
               sala_name:sala.sala_name,
               salaId:sala.salaId,
               turmaId:sala.turmaId,
               turmaName:sala.turmaName,
               professorName:professor.username,
               professorId:sala.professorId
            }
         })
         if(!arraySalas){
           return{
            status:400,
            message:'Não foi possível achar as salas relacionadas a essa turma!'
           }
         }
       
         return{
            status:200,
            message:'Requisição realizada com sucesso!',
            salas:arraySalas
         }

      } catch (error) {
         throw new Error(`${error}`);
      }
  }
  async getAllStudentsInTurmaByCoordenadorId(coordenadorId:string):Promise<{
   status:number;
   message:string;
   students?:any[]
  }>{

   try {
      
     const turmasCoordenador = await this.prisma.coordenador.findMany({
      where:{
         id:coordenadorId
      },
      select:{
         turmas:true
      }
     })

    const turmasAlunos = await Promise.all(
       Object.values(turmasCoordenador[0].turmas || []).map( async (turma)=>{
         const alunosInTurma = await this.prisma.turma_Alunos.findMany({
            where:{
               idTurma:turma.id
            },
            select:{
               aluno:{
               select:{
                  id:true,
                  username:true,
                  matricula:true,
                  email:true,
                  telefone:true,
                  turma:true,
                  parent_name:true,
                  parent2_name:true,
                  telefone_parent_1:true,
                  telefone_parent2_1:true
               }
               },
               turma:{
                  select:{
                     id:true,
                     turma_name:true
                  }
               }
            }
         })
         return alunosInTurma
       })
    )
     const arrayStudents = turmasAlunos.flat().map((aluno)=>{
        return{
         alunoId:aluno.aluno.id,
         alunoName:aluno.aluno.username,
         matricula:aluno.aluno.matricula,
         alunoEmail:aluno.aluno.email,
         alunoTelefone:aluno.aluno.telefone,
         turma:aluno.aluno.turma,
         turmaId:aluno.turma.id,
         turmaName:aluno.turma.turma_name,
         telefone_parent_1:aluno.aluno.telefone_parent_1,
         telefone_parent2_1:aluno.aluno.telefone_parent2_1,
         parent_name:aluno.aluno.parent_name,
         parent2_name:aluno.aluno.parent2_name
        }
     })


     if(!arrayStudents){
       return{
         status:400,
         message:'Requisição não realizada com sucesso!'
       }
     }

    return{
      status:200,
      message:'Requisição realizada com sucesso!',
      students:arrayStudents
    }


   } catch (error) {
      throw new Error(`${error}`);
   }




  }
  async getAllTeachers():Promise<{
   status:number;
   message:string;
   teachers?:any[];
  }>{
      try {
         
       const getAllTeachers = await this.prisma.professor.findMany({
         select:{
            id:true,
            subject:true,
            username:true,
            endereco:true,
            email:true,
            email_profissional:true,
            telefone1:true,
            telefone2:true,

         }
       })

        if(!getAllTeachers){
          return {
            status:400,
            message:'Não foi possível realizar a busca de professores!'
          }
        }

        return{
         status:200,
         message:'Requisição realizada com sucesso!',
         teachers:getAllTeachers
        }


      } catch (error) {
         throw new Error(`${error}`);
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
        salaId:salas_alunos.sala.id,
        salaName:salas_alunos.sala.sala_name,
        salaAvatar:salas_alunos.sala.avatar,
        idProfessor:salas_alunos.sala.professorId
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
        salaId:sala.salaId,  
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
  async getDesempenhoByStudentId(studentId:string):Promise<{
   status:number;
   message:string;
   desempenhoStudent?:any[]
  }>{

    try {
      
     const getDesempenhoByStudentId = await this.prisma.desempenho.findMany({
      where:{
         alunoId:studentId
      },
      select:{
        simulado:{
         select:{
            qtdQuestao:true
         }
        },
        portugues_correct_answers:true,
        matematica_correct_answers:true,
        fisica_correct_answers:true,
        quimica_correct_answers:true,
        biologia_correct_answers:true
      }
     })

     if(!getDesempenhoByStudentId){
       return{
         status:400,
         message:'Requisição mal sucedida , tente novamente!'
       }
     }

     return{
      status:200,
      message:'Requisição bem sucedida!',
      desempenhoStudent:getDesempenhoByStudentId
     }


    } catch (error) {
      throw new Error(`${error}`)
    }


  }
  async deleteTurmaById(deleteTurmaDto:DeleteTurmaDto):Promise<{
   message:string,
   status:number;
  }>{
 
   try {

     const isAuthorizedToDelete = await this.verifyUsersService.verifyCoordenadorPassword({
      coordenadorId:deleteTurmaDto.coordenadorId,
      coordenadorPassword:deleteTurmaDto.coordenadorPassword
     })

     if(isAuthorizedToDelete.isAuthorized){
        const deleteTurmaInput:Prisma.TurmaDeleteArgs = {
             where:{
              id:deleteTurmaDto.turmaId,
              idCoordenador:deleteTurmaDto.coordenadorId
             },
        }    
        const deletedTurmaById = await this.prisma.turma.delete(deleteTurmaInput);
          if(!deletedTurmaById){
            return{
              status:400,
              message:'Turma não deletada com sucesso , tente denovo!'
            }
          }
            return{
              status:200,
              message:"Turma excluída com sucesso!"
            }
     }else{
      return{
         status:400,
         message:"Senha Inválida , tente outra!"
      }
     }

   } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
         // Trate o erro específico do Prisma aqui
         return {
            status: 400,
            message: 'Erro ao excluir turma: ' + error.message,
         };
      } else {
         // Trate outros erros (se necessário)
         throw new Error(`Erro inesperado: ${error}`);
      }
   }
  }
  async deleteSalaById(salaId:string):Promise<{
   status:number;
   message:string;
  }>{

    try {
      //fazer a verificação da senha depois. talvez eu faça no frontend
      const deletedSalaById = await this.prisma.salas.delete({
         where:{
            id:salaId,
         }
      })

      if(!deletedSalaById){
        return{
         status:400,
         message:'Sala não foi excluída, tente novamente!'
        }
      }

      return{
         status:200,
         message:'Sala excluída com sucesso!'
      }

    } catch (error) {
      throw new Error(`${error}`);
    }

  }
  async deleteStudentById(alunoId:string):Promise<
  {
   status:number;
   message:string;
  }
  >{

    try {
      
     const deleteInputStudent:Prisma.AlunoDeleteArgs = {
          where:{
            id:alunoId
          }
     }
     const deletedStudentById = await this.prisma.aluno.delete(deleteInputStudent);
     if(!deletedStudentById){
      return {
         status:400,
         message:'Não foi possível excluir o aluno , tente novamente'
      }
     }

     return{
      status:200,
      message:'Aluno excluído com sucesso!'
     }

    } catch (error) {
      throw new Error(`${error}`);
    }



  }
  async deleteTeacherById(professorId:string):Promise<
  {
   status:number;
   message:string;
  }
  >{

    try {
      
     const deleteInputTeacher:Prisma.ProfessorDeleteArgs = {
        where:{
         id:professorId
        }
     }
   

     const deletedTeacherById = await this.prisma.professor.delete(deleteInputTeacher);

     if(!deletedTeacherById){
       return{
        status:400,
        message:'Não foi possível excluir o professor!'
       }
     }
 
     return{
      status:200,
      message:'Professor excluído com sucesso!'
     }

    } catch (error) {
      throw new Error(`${error}`);
    }

  }
  async deleteStudentInSala({alunoId , salaId}:DeleteSala_AlunosDto):Promise<
  {
   status:number;
   message:string;
  }>{

    try {
      const deletedStudentInSala = await this.prisma.salas_Alunos.delete({
         where:{
            idAluno_idSala:{
               idAluno:alunoId,
               idSala:salaId
            }
         }
      })

      if(!deletedStudentInSala){
         return{
            status:400,
            message:'Falha ao tentar excluir aluno da sala'
         }
      }

      return{
         status:200,
         message:'Aluno excluído da sala com sucesso!',
      }

    } catch (error) {
      throw new Error(`${error}`)
    }


  }
  async deleteStudentInTurma({turmaId , alunoId}:DeleteTurmaAlunoDto):Promise<
  {
   status:number;
   message?:string;
  }>{
   try {

       //pegar salaId pela turma

       const salas = await this.prisma.turma.findUnique({
         where:{
            id:turmaId
         },
         select:{
            salas:true
         }
       })
       //deletar o aluno de todas as salas 
       //antes de deletar ele da turma
       //pq n tem relaçao entre sala e turma , infelizmente

   

       const studentDeletedFromAllSalas = await Promise.all(
         Object.values(salas.salas).map(async (sala)=>{
          const alunoExistence = await this.prisma.salas_Alunos.findUnique({
            where:{
               idAluno_idSala:{
                  idAluno:alunoId,
                  idSala:sala.id
               }
               }
          })
          if(alunoExistence){
            const studentDeletedSala = await this.prisma.salas_Alunos.delete({
               where:{
                  idAluno_idSala:{
                     idAluno:alunoId,
                     idSala:sala.id
                  }
               }
              })
              return studentDeletedSala   
          }

         })
       )
      if(studentDeletedFromAllSalas){
         const deletedStudentInTurma = await this.prisma.turma_Alunos.delete({
            where:{
               idAluno_idTurma:{
                  idAluno:alunoId,
                  idTurma:turmaId
               }
            }
         })
      }

      

     if(!studentDeletedFromAllSalas){
       return{
         status:400,
         message:'Não foi possível excluir o aluno da turma'
       }  
     }

     return{
      status:200,
      message:'Aluno excluído da turma com sucesso!'
     }

   } catch (error) {
      throw new Error(`${error}`);
   }
  }
//basta chamar uma função lá
  //fineshed
  async updateCoordenadorByParcialField({fieldUpdate , fieldName , idCoordenador}:UpdateCoordenadorDto):Promise<any>{

   let updatedCoordenador;

    switch(fieldName){
      case 'username':
       updatedCoordenador = await  this.prisma.coordenador.update({
         where:{
            id:idCoordenador
         },
         data:{
            username:fieldUpdate
         }
       })
       break;
      case 'email':
      updatedCoordenador = await this.prisma.coordenador.update({
         where:{
            id:idCoordenador
         },
         data:{
            email:fieldUpdate
         }
      })
      break;
      case  'name_instituicao':
         updatedCoordenador = await  this.prisma.coordenador.update({
            where:{
               id:idCoordenador
            },
            data:{
               name_instituicao:fieldUpdate
            }
         })
         break;
         
      }
      return updatedCoordenador;
}
 async updateCoordenadorAvatar(updateCoordenadorAvatar:UpdateCoordenadorAvatar):Promise<
 {
   message:string,
   avatar:any
 }
 >{

   
 try {
   const updatedCoordenadorAvatar = await this.prisma.coordenador.update({
      where:{
         id:updateCoordenadorAvatar.coordenadorId
      },
      data:updateCoordenadorAvatar.avatar
   })

     return {
      message:'Alteração realizada com sucesso!',
      avatar:updatedCoordenadorAvatar.avatar
     }


 } catch (error) {
   throw new Error(`${error}`)
 }

}
 async updateStudentByPartialField({fieldUpdate , fieldName , idAluno}:UpdateDtoAluno):Promise<
 {
   status:number;
   message:string;
   updatedStudent?:any
 }>{
   try {
   
       let updatedStudent;
       switch(fieldName){
         case 'username':
         updatedStudent = await this.prisma.aluno.update({
            where:{
               id:idAluno
            },
            data:{
               username:fieldUpdate
            }
         })
         break;
         case 'email':
            updatedStudent = await this.prisma.aluno.update({
               where:{
                  id:idAluno
               },
               data:{
                  email:fieldUpdate
               }
            })
         break;
         case 'telefone':
            updatedStudent = await this.prisma.aluno.update({
               where:{
                  id:idAluno
               },
               data:{
                  telefone:fieldUpdate
               }
            })
         break;
         case 'turma':
            updatedStudent = await this.prisma.aluno.update({
               where:{
                  id:idAluno
               },
               data:{
                  turma:fieldUpdate
               }
            })
         break;
         case 'nome_responsavel_1':
            updatedStudent = await this.prisma.aluno.update({
               where:{
                  id:idAluno
               },
               data:{
                  parent_name:fieldUpdate
               }
            })
         break;
         case 'telefone_responsavel_1':
            updatedStudent = await this.prisma.aluno.update({
               where:{
                  id:idAluno
               },
               data:{
                  telefone_parent_1:fieldUpdate
               }
            })
         break;
         case 'nome_responsavel_2':
            updatedStudent = await this.prisma.aluno.update({
               where:{
                  id:idAluno
               },
               data:{
                  parent2_name:fieldUpdate
               }
            })
         break;
         case 'telefone_responsavel_2':
            updatedStudent = await this.prisma.aluno.update({
               where:{
                  id:idAluno
               },
               data:{
                  telefone_parent2_1:fieldUpdate
               }
            })
         break;
       }

       if(!updatedStudent){
         return{
            status:400,
            message:`Não foi possível atualizar o ${fieldName} do Aluno`
         }
       }

       return{
         status:200,
         message:`Alteração do ${fieldName} do Aluno realizada com sucesso`,
         updatedStudent:updatedStudent
       }

   } catch (error) {
      throw new Error(`${error}`)
   }
 }
 async updateTeacherByPartialField({fieldName , fieldUpdate , idProfessor}:UpdateProfessorDto):Promise<
 {
   status:number;
   message:string;
   updatedTeacher?:any
 }
 >{
     try {
      
      let updatedProfessor;
      switch(fieldName){
        case 'username':
        updatedProfessor = await this.prisma.professor.update({
         where:{
            id:idProfessor
         },
         data:{
            username:fieldUpdate
         }
        })
        break;
        case 'endereco':
         updatedProfessor = await this.prisma.professor.update({
            where:{
               id:idProfessor
            },
            data:{
               endereco:fieldUpdate
            }
           })
        break;
        case 'email':
         updatedProfessor = await this.prisma.professor.update({
            where:{
               id:idProfessor
            },
            data:{
               email:fieldUpdate
            }
           })
        break;
        case 'email_profissional':
         updatedProfessor = await this.prisma.professor.update({
            where:{
               id:idProfessor
            },
            data:{
               email_profissional:fieldUpdate
            }
           })
        break;
        case 'telefone1':
         updatedProfessor = await this.prisma.professor.update({
            where:{
               id:idProfessor
            },
            data:{
               telefone1:fieldUpdate
            }
           })
        break;
        case 'telefone2':
         updatedProfessor = await this.prisma.professor.update({
            where:{
               id:idProfessor
            },
            data:{
               telefone2:fieldUpdate
            }
           })
        break;
      }

     if(!updatedProfessor){
       return{
         status:400,
         message:`Não foi possível atualizar o ${fieldName} do professor`,
       }
     }

     return{
      status:200,
      message:`Atualização do ${fieldName} do professor realizada com sucesso!`,
      updatedTeacher:updatedProfessor  
   }

     } catch (error) {
      throw new Error(`${error}`)
     }
 }
  async createStudentsAccounts(studentsAccounts:AlunoCreateDto[]):Promise<
  {
   status?:number;
   students?:AlunoCreateDto[],
   errors?:any[]
  }
  >{
     let createdOneStudent
     let createdStudentsAccounts:any[]
     let errors = []
     let detailsErrors = []
     let studentsValited
     let StudentValidate:any 
     //percorrer todo o objeto e verificar a existencia de erros
     //agrupar os erros
     let valitedStudentsAccounts = await Promise.all(
        studentsAccounts.map(
           async (student)=>{
               StudentValidate = new AlunoCreateDto();
               StudentValidate.username = student.username;
               StudentValidate.email = student.email;
               StudentValidate.password = student.password;
               StudentValidate.role = student.role;
               StudentValidate.telefone = student.telefone;
               StudentValidate.matricula = student.matricula;
               StudentValidate.turma = student.turma;
               StudentValidate.parent_name = student.parent_name;
               StudentValidate.telefone_parent_1 = student.telefone_parent_1;
               StudentValidate.telefone_parent_2 = student.telefone_parent_2;
             studentsValited = await validate(StudentValidate);
            if(studentsValited.length > 0){
             detailsErrors = detailsErrors.concat(
               studentsValited.map((studentValited:any)=>({
                  property:studentValited.property,
                  constraints:Object.values(studentValited.constraints),
                  value:studentValited.value,
                  children:studentValited.children,
                  context:studentValited.contexts,
                  target:studentValited.target,
                  message:Object.values(studentValited.constraints).join(', ')
                }))
             )

            return null
        }else{
         StudentValidate.username = student.username;
         StudentValidate.email = student.email;
         StudentValidate.password = student.password;
         StudentValidate.role = student.role;
         StudentValidate.telefone = student.telefone;
         StudentValidate.matricula = student.matricula;
         StudentValidate.turma = student.turma;
         StudentValidate.parent_name = student.parent_name;
         StudentValidate.telefone_parent_1 = student.telefone_parent_1;
         StudentValidate.telefone_parent_2 = student.telefone_parent_2;
   

         createdOneStudent = await this.alunoService.create(student);
         return createdOneStudent;
        }
         })
     )  
   //cadastrar usuários temporários
   /**
    if(detailsErrors.length <= 0){
        valitedStudentsAccounts = await Promise.all(
          studentsAccounts.map( async (student)=>{
             StudentValidate = new AlunoCreateDto();
             StudentValidate.username = student.username;
             StudentValidate.email = student.email;
             StudentValidate.password = student.password;
             StudentValidate.role = student.role;
             StudentValidate.telefone = student.telefone;
             StudentValidate.matricula = student.matricula;
             StudentValidate.turma = student.turma;
             StudentValidate.parent_name = student.parent_name;
             StudentValidate.telefone_parent_1 = student.telefone_parent_1;
             StudentValidate.telefone_parent_2 = student.telefone_parent_2;
       
 
             createdOneStudent = await this.alunoService.create(student);
             return createdOneStudent;
   
        
 
          })
        )
    }     
      errors = await Promise.all(
       detailsErrors.map((error)=>{
          return {
             matricula:error.target.matricula,
             value:error.value,
             message:error.message,
          }
       })
      )
      
    * 
    */
     
      //coloca apenas os objetos válidos
   // createdStudentsAccounts = valitedStudentsAccounts.filter(account => account !== null);
   
 /**
  if(detailsErrors.length > 0){
   return{
      status:400,
      errors:errors
   }
  }else{
   return{
      status:201,
      students:createdStudentsAccounts
   }
  }
  * 
  */
   //filtragem temporária

   createdStudentsAccounts = valitedStudentsAccounts.filter((account)=> account !== null);



 return{
   status:201,
   students:createdStudentsAccounts,
   
 }

}
 async createTeachersAccounts(teachersAccounts:ProfessorCreateDto[]):Promise<{
   status?:number;
   teachers?:ProfessorCreateDto[],
   errors?:any[]
}>{

    let createdOneTeacher
    let createdTeachersAccounts:any[]
    let errors = []
    let detailsErrors = []
    let teachersValited
    let TeacherValidate:any
    
    let valitedTeachersAccounts = await Promise.all(
      teachersAccounts.map(
         async (teacher)=>{
             TeacherValidate = new ProfessorCreateDto();
             TeacherValidate.username = teacher.username;
             TeacherValidate.email = teacher.email;
             TeacherValidate.password = teacher.password;
             TeacherValidate.role = teacher.role;
             TeacherValidate.telefone1 = teacher.telefone1;
             TeacherValidate.telefone2 = teacher.telefone2;
             TeacherValidate.email_profissional = teacher.email_profissional;
             TeacherValidate.subject = teacher.subject;
             TeacherValidate.cpf = teacher.cpf;
             TeacherValidate.endereco = teacher.endereco;
             TeacherValidate.titulacao = teacher.titulacao;
           teachersValited = await validate(TeacherValidate);
          if(teachersValited.length > 0){
           detailsErrors = detailsErrors.concat(
             teachersValited.map((teacherValited:any)=>({
                property:teacherValited.property,
                constraints:Object.values(teacherValited.constraints),
                value:teacherValited.value,
                children:teacherValited.children,
                context:teacherValited.contexts,
                target:teacherValited.target,
                message:Object.values(teacherValited.constraints).join(', ')
   
              }))
           )

          return null
      }else{
         TeacherValidate.username = teacher.username;
         TeacherValidate.email = teacher.email;
         TeacherValidate.password = teacher.password;
         TeacherValidate.role = teacher.role;
         TeacherValidate.telefone1 = teacher.telefone1;
         TeacherValidate.telefone2 = teacher.telefone2;
         TeacherValidate.email_profissional = teacher.email_profissional;
         TeacherValidate.subject = teacher.subject;
         TeacherValidate.cpf = teacher.cpf;
         TeacherValidate.endereco = teacher.endereco;
         TeacherValidate.titulacao = teacher.titulacao;    

          createdOneTeacher = await this.professorService.create(teacher);
          return createdOneTeacher;
      }
       })

      

       
   )  
 //cadastrar usuários temporários
 /**  * 
 if(detailsErrors.length <= 0){
     valitedTeachersAccounts = await Promise.all(
       teachersAccounts.map( async (teacher)=>{
         TeacherValidate = new ProfessorCreateDto();
         TeacherValidate.username = teacher.username;
         TeacherValidate.email = teacher.email;
         TeacherValidate.password = teacher.password;
         TeacherValidate.role = teacher.role;
         TeacherValidate.telefone1 = teacher.telefone1;
         TeacherValidate.telefone2 = teacher.telefone2;
         TeacherValidate.email_profissional = teacher.email_profissional;
         TeacherValidate.subject = teacher.subject;
         TeacherValidate.cpf = teacher.cpf;
         TeacherValidate.endereco = teacher.endereco;
         TeacherValidate.titulacao = teacher.titulacao;    

          createdOneTeacher = await this.professorService.create(teacher);
          return createdOneTeacher;

     

       })
     )
 }     
   
   errors = await Promise.all(
    detailsErrors.map((error)=>{
       return {
          value:error.value,
          message:error.message,
       }
    })
   )
  */
   
   
    //coloca apenas os objetos válidos
 // createdStudentsAccounts = valitedStudentsAccounts.filter(account => account !== null);
 
   /**
    * 
   if(detailsErrors.length > 0){
    return{
       status:400,
       errors:errors
    }
   }else{
    return{
       status:201,
       teachers:createdTeachersAccounts
    }
   }
    * 
    */
    createdTeachersAccounts = valitedTeachersAccounts.filter((accountTeacher)=> accountTeacher !== null);

   return{
      status:201,
      teachers:createdTeachersAccounts
   }

}

}
 