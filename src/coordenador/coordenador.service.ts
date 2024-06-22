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
import { CreateTurmaDto, DeleteTurmaDto } from "./dto/CRUD-turma.dto";
import { CreateSala } from "./dto/CRUD-sala.dto";
import { SalasAlunosDto } from "./dto/create-alunoSalas.dto";
import { UpdateCoordenadorDto } from "./dto/update-coordenador.dto";
import { GetAllSalasDto } from "./dto/getAllSalas.dto";
import { UpdateCoordenadorAvatar } from "./dto/CRUD-coordenador.dto";
import { AlunoCreateDto } from "src/aluno/dto/CRUD-aluno.dto";
import { AlunoService } from "src/aluno/aluno.service";
import { validate } from "class-validator";
import { createReadStream } from "fs";
import { ProfessorCreateDto } from "src/professor/dto/CRUD-professor.dto";
import { ProfessorService } from "src/professor/professor.service";
import { AlunoId } from "./dto/create-alunoSalas.dto";
import { VerifyUsersExistenceService } from "./functions/coordenador-functions";

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
   //fazer uma anotation de verificação
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
      });
      return coordenador;
   }

  //criar uma turma pelo coordenador
  //os dados criados ficarão desconexos
  //pq o turma dos alunos é aleatório
  async createTurma(createTurmaDto:CreateTurmaDto):Promise<any>{
     const turmaCreateInputData:Prisma.TurmaCreateInput = {
      ...createTurmaDto
     }
     const createdTurmaByCoordenador = await this.prisma.turma.create({data:turmaCreateInputData});
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
  //encontrar todas as turmas pelo coordenador
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
  //criar uma sala pelo coordenador
  //professor e alunos
  //id da turma em que a sala tá
  //id do coordenador- responsável por criar as turmas
  //array de ids - alunos
  //array de ids - pode ser 1 ou mais professores da mesma matéria
  //na hora de criar a sala , relacionar a mesma com o(s) professores
  //inicialmente , registringir ao coordenador cadastrar apenas 1 professor
  //para criar uma sala , preciso criar uma turma
  //adicionar restrições
  
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
           
                 const getClassProfessorResult = await this.prisma.salas.findUnique({
                    where:{
                       id:createdSala.id
                    },
                    select:{
                       professor:true
                    }
                 })
           
                const createdAlunosSalas = await this.createAlunoInSalas(
                 {
                    salaId:SalaDataInput.id , 
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
  //função para criar um aluno na sala
  //fazer função para criar vários alunos na sala
  //passar o id da sala criada na função create sala logo após criá-la
  //tudo isso pra n ficar dando npx prisma migrate dev --name init
  async createAlunoInSalas({salaId , alunosId}:SalasAlunosDto):Promise<any>{
     
     //this.prisma.salas_Alunos.create({data:inputDataSalasAlunos});
     const salaInputData: Prisma.SalasFindUniqueArgs = {
      where: {
         id: salaId,
      },
   };
     const createdSalaAlunos = await Promise.all(alunosId.map(async (alunoId:AlunoId)=>{
        
        const alunoCurrentInputData:Prisma.AlunoFindUniqueArgs = {
         where:{
          id:alunoId.alunoId
         },
       }
      const findCurrentAlunoData = await this.prisma.aluno.findUnique(alunoCurrentInputData)
      const findCurrentSalaByAlunoData = await this.prisma.salas.findUnique(salaInputData);
      
   
      const inputDataSalasAlunos:Prisma.Salas_AlunosCreateInput = {
        sala:{
         connect:findCurrentSalaByAlunoData
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

  async deleteStudentInSala(){

  }
  async deleteTeacherInSala(){

  }
  async deleteTurmaById(deleteTurmaDto:DeleteTurmaDto):Promise<{
   message:string,
   status:number;
  }>{
 
   try {
 
      const deleteTurmaInput:Prisma.TurmaDeleteArgs = {
           where:{
            id:deleteTurmaDto.turmaId
           },

           
      }    
      const deleteSalasInput:Prisma.SalasDeleteManyArgs = {
         where:{
            turmaId:deleteTurmaDto.turmaId
         }
      }
    console.log("id turma=>" , deleteTurmaDto.turmaId);
      const deletedTurmaById = await this.prisma.turma.delete(deleteTurmaInput);
     // const deletedSalasByTurmaId = await this.prisma.salas.deleteMany(deleteSalasInput);
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
  async deleteSalaById(){

  }
  async deleteStudent(){

  }
  async deleteTeacher(){

  }

 async updateProfessorInSala(){

 }

  // essa função não vai mudar 
  //alterar essa função para funcionar corretamente
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
            telefone1:fieldUpdate,
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
      return updatedCoordenador;
}
  //deletar próprio perfil
async deleteCoordenadorById(id:string):Promise<any>{
  try {
     
   // id = id.startsWith(':') ? id.slice(1) : id;

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
 // colocar no service de aluno e puxar no controller de aluno
 // aqui está errado
 //função que deve estar no aluno
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
   //fazer upload de avatar
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

 //passar o id do aluno
 async updateStudentByPartialField(){

 }
 async updateTeacherByPartialField(){

 }



//criar vários alunos com um arquivo excel
//para fazer testes  de função vou retirar a filtragem de erros
//cadastrar apenas os que estão com dados corretos na planilha
//depois colocar novamente a filtragem de erros
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
//criar vários professores com um arquivo excel
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
 