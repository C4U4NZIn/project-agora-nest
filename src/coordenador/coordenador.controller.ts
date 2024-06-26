import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put, UploadedFile  } from "@nestjs/common";
import { Request, Response, response } from "express";
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { CoordenadorService } from "./coordenador.service";
import { CoordenadorCreateDto } from "./dto/CRUD-coordenador.dto";
import { AlunoCreateDto, UpdateDtoAluno } from "src/aluno/dto/CRUD-aluno.dto";
import { ProfessorService } from "src/professor/professor.service";
import { AlunoService } from "src/aluno/aluno.service";
import { ProfessorCreateDto, UpdateProfessorAvatarDto, UpdateProfessorDto } from "src/professor/dto/CRUD-professor.dto";
import { CreateTurmaDto, DeleteTurmaAlunoDto, DeleteTurmaDto } from "./dto/CRUD-turma.dto";
import { AllTurmasDto } from "./dto/findAllTurmas-dto.dto";
import { CreateSala, DeleteSala_AlunosDto } from "./dto/CRUD-sala.dto";
import { SalasAlunosDto } from "./dto/create-alunoSalas.dto";
import { UpdateCoordenadorDto } from "./dto/CRUD-coordenador.dto";
import { GetAllSalasDto } from "./dto/getAllSalas.dto";
import { UpdateCoordenadorAvatar } from "./dto/CRUD-coordenador.dto";
import * as XLSX from 'xlsx'
import { UseInterceptors } from "@nestjs/common";
import { FilesService } from "src/files/files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { json } from "stream/consumers";
import { VerifyUsersExistenceService } from "./functions/coordenadorFunctions";


@IsPublic()
@Controller('coordenador')
export class CoordenadorController{
    constructor(
        private readonly coordenadorService:CoordenadorService,
        private readonly professorService:ProfessorService,
        private readonly alunoService:AlunoService,
        private readonly filesService:FilesService,
       // private readonly verifyUsersService:VerifyUsersExistenceService
    ){}
     //funcionou
    @Post('post')
    async createCoordenador(@Body() coordenadorCreateDto:CoordenadorCreateDto , @Res() res:Response){

     const response = await this.coordenadorService.create(coordenadorCreateDto);
     return res.json({
      message:'Requisition sucesfully',
      ...response    
     })

    }
    //funcionou
    @Post('post-aluno')
    async createAluno(@Body() alunoCreateDto:AlunoCreateDto , @Res() res:Response){
        const responseService = await this.alunoService.create(alunoCreateDto);
        return res.json({
         message:'Requisition sucesfully',
         ...responseService
        })
    }
    //funcionou
    @Post('post-professor')
    async createProfessor(@Body() profCreateDto:ProfessorCreateDto , @Res() res:Response){
        const responseService = await this.professorService.create(profCreateDto);
        return res.json({
         message:'Requisition sucesfully',
        ...responseService 
        })
    }
    //funcionou
    @Post('post-turma')
   async createTurma(@Body() createTurma:CreateTurmaDto , @Res() res:Response):Promise<any>{

    const response = await this.coordenadorService.createTurma(createTurma);

    if(!response){
         return res.status(400).json({
          message:'Requisição mal sucedida! Tente de novo!'
         })
    }

    return res.status(201).json({
      message:"Turma criada com sucesso!",
      ...response
    })
   }
   //funcionou
   @Post('post-sala')
   async createSala(@Body() createSalaDto:CreateSala , @Res() res:Response){
    
     const responseCoordenadorService = await this.coordenadorService.createSala(createSalaDto);

     if(responseCoordenadorService.status !== 201){
      return res.status(400).json({
        status:responseCoordenadorService.status,
        message:"Impossível cadastrar os alunos e o professor na sala"
    })
     }

     return res.status(201).json({
         ...responseCoordenadorService
     })


   }
   //funcionou
   @Post('findAllTurmas')
   async findAllTurmas(@Body() {idCoordenador}:AllTurmasDto, @Res() res:Response):Promise<any>{

      const allTurmasByIdCoordenador = await this.coordenadorService.findAllTurmas(idCoordenador);

      if(!allTurmasByIdCoordenador){
        return res.status(403).json({
            message:"Requisition Uncessfully! Please Try again!"
        })
      }

      return res.status(201).json({
        response:allTurmasByIdCoordenador
      })


   }
    //funcionou
    @Get('getAllStudentsInTurma/:id')
    async getAllStudentsInTurmaByCoordenadorId(@Param('id') coordenadorId:string , @Res() res:Response){
      try {
        const responseGetAllStudentsInTurmaByCoordenadorId = await this.coordenadorService.getAllStudentsInTurmaByCoordenadorId(coordenadorId);
        if(responseGetAllStudentsInTurmaByCoordenadorId.status !== 200){
          return res.status(400).json({
            status:responseGetAllStudentsInTurmaByCoordenadorId.status,
            message:responseGetAllStudentsInTurmaByCoordenadorId.message
          })
        }

        return res.status(200).json({
          status:responseGetAllStudentsInTurmaByCoordenadorId.status,
          message:responseGetAllStudentsInTurmaByCoordenadorId.message,
          alunosInsideTurma:responseGetAllStudentsInTurmaByCoordenadorId.students
        })
      
      } catch (error) {
        throw new Error(`${error}`);
       }     
    }
    //funcionou
    @Get('getAllSalasInTurmaByCoordId/:id')
    async getAllSalasInTurmaByCoordenadorId(@Param('id') coordenadorId:string , @Res() res:Response){
     
      try {
        const responseGetAllSalasByCoordenadorId = await this.coordenadorService.getAllSalasByCoordenadorId(coordenadorId);
        if(responseGetAllSalasByCoordenadorId.status !== 200){
          return res.status(400).json({
            status:responseGetAllSalasByCoordenadorId.status,
            message:responseGetAllSalasByCoordenadorId.message
          })
        }

        return res.status(200).json({
          status:responseGetAllSalasByCoordenadorId.status,
          message:responseGetAllSalasByCoordenadorId.message,
          salas:responseGetAllSalasByCoordenadorId.salas
        })
      
      } catch (error) {
        throw new Error(`${error}`);
       }
    }
    //funcionou
    @Get('getAllTurmasByCoordenadorId/:id')
    async getAllTurmasByCoordenadorId(@Param('id') coordenadorId:string , @Res() res:Response){
      try {
        const responseGetAllTurmas = await this.coordenadorService.findAllTurmas(coordenadorId);

        if(responseGetAllTurmas.status !== 200){
           return res.status(400).json({
            status:responseGetAllTurmas.status,
            message:responseGetAllTurmas.message
           })
        }

        return res.status(200).json({
          status:responseGetAllTurmas.status,
          message:responseGetAllTurmas.message,
          turmas:responseGetAllTurmas.turmas
        })

      } catch (error) {
        throw new Error(`${error}`);
      }
    }
    //funcionou
    @Get('getAllTeachers')
    async getAllTeachers(@Res() res:Response){

      try {
        const responseGetAllTeachers = await this.coordenadorService.getAllTeachers();

        if(responseGetAllTeachers.status !== 200){
           return res.status(400).json({
            status:responseGetAllTeachers.status,
            message:responseGetAllTeachers.message
           })
        }

        return res.status(200).json({
          status:responseGetAllTeachers.status,
          message:responseGetAllTeachers.message,
          teachers:responseGetAllTeachers.teachers
        })

      } catch (error) {
        throw new Error(`${error}`);
      }
        
    }
    //
    @Get('getDesempenhoByStudentId/:id')
    async getDesempenhoByStudentId(@Param('id') alunoId:string , @Res() res:Response){}
    //
    @Post('updatePartial')
    async updateCoordenador(@Body() coordenadorUpdateDto:UpdateCoordenadorDto , @Res() res:Response){
        const responseUpdatedCoordenador = await this.coordenadorService.updateCoordenadorByParcialField(coordenadorUpdateDto);

        try {

           if(responseUpdatedCoordenador){
               res.json({
                   status:202,
                   updatedAlunoDataParcial:responseUpdatedCoordenador,
                   message:"Requisição realizada com sucesso"
               })

           }else{
               res.json({
                   status:409,
                   updatedAlunoDataParcial:'',
                   message:"Requisição não foi realizada corretamente"
               })
           }
        } catch (error) {
           throw new Error(`${error}`)
        }
    }
    //
    @Post('update-avatar')
    async updateCoordenadorAvatar(@Body() updateCoordenadorAvatar:UpdateCoordenadorAvatar , @Res() res:Response){

      try {
        
     const resUpdatedCoordenadorAvatar = await this.coordenadorService.updateCoordenadorAvatar(updateCoordenadorAvatar);

     if(resUpdatedCoordenadorAvatar){
        return res.json({
            ...resUpdatedCoordenadorAvatar
        })
     }

      } catch (error) {
        throw new Error(`${error}`)
      }


    }
    //
    @Post('update-teacher')
    async updateTeacherByPartialField(@Body() updateTeacher:UpdateProfessorDto , @Res() res:Response){
      try {
          
        const responseUpdatedTeacher = await this.coordenadorService.updateTeacherByPartialField(updateTeacher);
         
        if(responseUpdatedTeacher.status !== 200){
         res.status(400).json({
           status:responseUpdatedTeacher.status,
           message:responseUpdatedTeacher.message
         })
       }else{
         res.status(200).json({
           status:responseUpdatedTeacher.status,
           message:responseUpdatedTeacher.message,
           updatedTeacher:responseUpdatedTeacher
         })
       }
      } catch (error) {
       throw new Error(`${error}`);
      }
    }
    //
    @Post('update-student')
    async updateStudentByPartialField(@Body() updateStudent:UpdateDtoAluno , @Res() res:Response){
      try {
          
        const responseUpdatedStudent = await this.coordenadorService.updateStudentByPartialField(updateStudent);
         
        if(responseUpdatedStudent.status !== 200){
         res.status(400).json({
           status:responseUpdatedStudent.status,
           message:responseUpdatedStudent.message
         })
       }else{
         res.status(200).json({
           status:responseUpdatedStudent.status,
           message:responseUpdatedStudent.message,
           updatedStudent:responseUpdatedStudent.updatedStudent
         })
       }
      } catch (error) {
       throw new Error(`${error}`);
      }
    }
    //Cadastros de aluos By xlsx archive
    @Post('upload-students')
    @UseInterceptors(FileInterceptor('students-files'))
    async uploadStudents(@UploadedFile() fileStudentsAccounts:Express.Multer.File , @Res() res:Response){
       const StudentsAccountsFileToJson = await this.filesService.getAllStudentsAccounts(fileStudentsAccounts);
      
      
      const createdStudentsAccounts = await this.coordenadorService.createStudentsAccounts(StudentsAccountsFileToJson.students);

      if(createdStudentsAccounts.status !== 201){
//        throw new Error("Coloque os dados corretamente ou verifique a formatação do seu arquivo!");
        return res.json({
          status:createdStudentsAccounts.status,
          result:createdStudentsAccounts.errors,
          numbErrors:createdStudentsAccounts.errors.length
      })  
        
      }else{
        
                return res.json({
                  status:createdStudentsAccounts.status,
                  result:createdStudentsAccounts.students
                })  

      }

    }
  //cadastros de professores através de um arquivo xlsx  
   @Post('upload-teachers')
   @UseInterceptors(FileInterceptor('teachers-files'))
   async uploadTeachers(@UploadedFile() fileTeachersAccounts:Express.Multer.File , @Res() res:Response){

    const TeachersAccountsFileToJson = await this.filesService.getAllTeachersAccounts(fileTeachersAccounts);
      
      
    const createdTeachersAccounts = await this.coordenadorService.createTeachersAccounts(TeachersAccountsFileToJson.teachers);

    if(createdTeachersAccounts.status !== 201){
//        throw new Error("Coloque os dados corretamente ou verifique a formatação do seu arquivo!");
      return res.json({
        status:createdTeachersAccounts.status,
        result:createdTeachersAccounts.errors,
        numbErrors:createdTeachersAccounts.errors.length
    })  
      
    }else{
      
              return res.json({
                status:createdTeachersAccounts.status,
                result:createdTeachersAccounts.teachers
              })  

    }


   }
   //
   @Delete('turma/:id')
   async deleteTurmaById(
    @Param('id') turmaId:string ,
    @Res() res:Response
  
  ){

    try {
       
      // turmaId = turmaId.startsWith(':') ? turmaId.slice(1) : turmaId;

      const responseDeletedTurma = await this.coordenadorService.deleteTurmaById(turmaId);

      if(responseDeletedTurma.status !== 200){
        res.status(400).json({
          status:responseDeletedTurma.status,
          message:responseDeletedTurma.message
        })
      }else{
        res.status(200).json({
          status:responseDeletedTurma.status,
          message:responseDeletedTurma.message
        })
      }


    } catch (error) {
      throw new Error(`${error}`)
    }




   }
   //
   @Delete('sala/:id')
   async deleteSalaById(@Param('id') salaId:string , @Res() res:Response){
         try {
          
           const responseDeletedSala = await this.coordenadorService.deleteSalaById(salaId);
            
           if(responseDeletedSala.status !== 200){
            res.status(400).json({
              status:responseDeletedSala.status,
              message:responseDeletedSala.message
            })
          }else{
            res.status(200).json({
              status:responseDeletedSala.status,
              message:responseDeletedSala.message
            })
          }
         } catch (error) {
          throw new Error(`${error}`);
         }
   }
   //
   @Delete('student/:id')
   async deleteStudentById(@Param('id') alunoId:string , @Res() res:Response){
    try {
          
      const responseDeletedStudent = await this.coordenadorService.deleteStudentById(alunoId);
       
      if(responseDeletedStudent.status !== 200){
       res.status(400).json({
         status:responseDeletedStudent.status,
         message:responseDeletedStudent.message
       })
     }else{
       res.status(200).json({
         status:responseDeletedStudent.status,
         message:responseDeletedStudent.message
       })
     }
    } catch (error) {
     throw new Error(`${error}`);
    }
   }
   //
   @Delete('teacher/:id')
   async deleteTeacherById(@Param('id') professorId:string ,  @Res() res:Response){
    try {
          
      const responseDeletedTeacher = await this.coordenadorService.deleteTeacherById(professorId);
       
      if(responseDeletedTeacher.status !== 200){
       res.status(400).json({
         status:responseDeletedTeacher.status,
         message:responseDeletedTeacher.message
       })
     }else{
       res.status(200).json({
         status:responseDeletedTeacher.status,
         message:responseDeletedTeacher.message
       })
     }
    } catch (error) {
     throw new Error(`${error}`);
    }      
   }
   @Delete('student-turma')
   async deleteStudentInTurmaById(@Body() deleteStudentTurma:DeleteTurmaAlunoDto , @Res() res:Response){
     try {
       const deletedStudentFromTurmaCoordService = await this.coordenadorService.deleteStudentInTurma(deleteStudentTurma);
       
       if(deletedStudentFromTurmaCoordService.status !== 200){
         return res.status(400).json({
          status:200,
          message:deletedStudentFromTurmaCoordService.message
         })
       }
      
       return res.status(200).json({
        status:200,
        message:deletedStudentFromTurmaCoordService.message
       })
     
     
      }catch (error) {
      throw new Error(`${error}`);
     }
   }
   
   @Delete('student-sala')
   async deleteStudentInSalaById(@Body() deleteStudentSala:DeleteSala_AlunosDto , @Res() res:Response){
    try {
      const deletedStudentFromSalaCoordService = await this.coordenadorService.deleteStudentInSala(deleteStudentSala);
    
      if(deletedStudentFromSalaCoordService.status !== 200){
         return  res.status(400).json({
          status:deletedStudentFromSalaCoordService.status,
          message:deletedStudentFromSalaCoordService.message
         })
        }

        return res.status(200).json({
          status:deletedStudentFromSalaCoordService.status,
          message:deletedStudentFromSalaCoordService.message
         })
    
    } catch (error) {
     throw new Error(`${error}`);
    }
  
   }
  

}