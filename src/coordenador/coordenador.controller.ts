import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put, UploadedFile  } from "@nestjs/common";
import { Request, Response, response } from "express";
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { CoordenadorService } from "./coordenador.service";
import { CoordenadorCreateDto } from "./dto/CRUD-coordenador.dto";
import { AlunoCreateDto } from "src/aluno/dto/CRUD-aluno.dto";
import { ProfessorService } from "src/professor/professor.service";
import { AlunoService } from "src/aluno/aluno.service";
import { ProfessorCreateDto } from "src/professor/dto/CRUD-professor.dto";
import { CreateTurmaDto, DeleteTurmaDto } from "./dto/CRUD-turma.dto";
import { AllTurmasDto } from "./dto/findAllTurmas-dto.dto";
import { CreateSala } from "./dto/CRUD-sala.dto";
import { SalasAlunosDto } from "./dto/create-alunoSalas.dto";
import { UpdateCoordenadorDto } from "./dto/update-coordenador.dto";
import { GetAllSalasDto } from "./dto/getAllSalas.dto";
import { UpdateCoordenadorAvatar } from "./dto/CRUD-coordenador.dto";
import * as XLSX from 'xlsx'
import { UseInterceptors } from "@nestjs/common";
import { FilesService } from "src/files/files.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { json } from "stream/consumers";
import { VerifyUsersExistenceService } from "./functions/coordenador-functions";


@IsPublic()
@Controller('coordenador')
export class CoordenadorController{
    constructor(
        private readonly coordenadorService:CoordenadorService,
        private readonly professorService:ProfessorService,
        private readonly alunoService:AlunoService,
        private readonly filesService:FilesService,
        private readonly verifyUsersService:VerifyUsersExistenceService
    ){}

    @Post('post')
    async createCoordenador(@Body() coordenadorCreateDto:CoordenadorCreateDto , @Res() res:Response){

     const response = await this.coordenadorService.create(coordenadorCreateDto);
     return res.json({
      message:'Requisition sucesfully',
      ...response    
     })

    }
    @Post('post-aluno')
    async createAluno(@Body() alunoCreateDto:AlunoCreateDto , @Res() res:Response){
        const responseService = await this.alunoService.create(alunoCreateDto);
        return res.json({
         message:'Requisition sucesfully',
         ...responseService
        })
    }
    @Post('post-professor')
    async createProfessor(@Body() profCreateDto:ProfessorCreateDto , @Res() res:Response){
        const responseService = await this.professorService.create(profCreateDto);
        return res.json({
         message:'Requisition sucesfully',
        ...responseService 
        })
    }
    @Post('post-turma')
   async createTurma(@Body() createTurma:CreateTurmaDto):Promise<any>{

    const response = await this.coordenadorService.createTurma(createTurma);

    if(!response){
        return {
            message:"requisition Uncessfully!"
        }
    }

    return {
        message:"requisition Sucessfully!",
        ...response
    }
   }
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
   //fazer um endpoint apenas no criar sala
   //passar um dto com um array de id de alunos e professores
   @Post('sala')
   async createSala(@Body() createSalaDto:CreateSala , @Res() res:Response){
    
     const responseCoordenadorService = await this.coordenadorService.createSala(createSalaDto);

     if(responseCoordenadorService.status !== 201){
      return res.status(400).json({
        status:responseCoordenadorService.status,
        message:"Impossível cadastrar os alunos e o professor a sala"
    })
     }

     return res.status(201).json({
         ...responseCoordenadorService
     })


   }
   @Post('createAlunosInSalas')
   async createAlunosInSalas(@Body() createSalasAlunos:SalasAlunosDto ,@Res() res:Response){
       
       const response = await this.coordenadorService.createAlunoInSalas(createSalasAlunos);
       
       res.status(201).json({
           ...response
        })
        
    }
   @Get('findAllProfessores')
    async findAllProfs(@Res() res:Response){
     
     const response = await this.professorService.findAllProfessores();
    
    
     res.status(201).json({
      ...response
     })
    }
   @Get('findAllAlunos')
    async findAllAlunos(@Res() res:Response){
    
    const response = await this.alunoService.findAllAlunos();
    
    res.status(201).json({
     ...response
    })
    
    }
    @Get('findAllSalas')
    async findAllSalas(){
        
    }
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
    @Delete('coordenador/:id')
    async deleteCoordenador(@Param('id') id:string , @Res() res:Response){
        const responseFromDeleteCoordenadorService = await this.coordenadorService.deleteCoordenadorById(id);

        try {
          if(responseFromDeleteCoordenadorService){
            res.json({
              status:202,
              message:"Requisição realizada com sucesso!",
              response:responseFromDeleteCoordenadorService
            })
          }else{
              res.json({
                  status:409,
                  message:"Não foi possível excluir o usuário"
              })
          }
        } catch (error) {
          throw new Error(`${error}`)
        }
    }
    //tirar daqui esse end point e colocar no controller de aluno
    //assim como o service 
    @Post('getAllSalas')
    async getAllSalasByAlunoId(@Body() getAllSalasByAlunoIdDto:GetAllSalasDto , @Res() res:Response){

        const returnedFromResponseAllInfoSalas = await this.coordenadorService.getAllSalasByAlunoId(getAllSalasByAlunoIdDto);
       
        if(returnedFromResponseAllInfoSalas){
          return  res.json({
             status:202,
            data:returnedFromResponseAllInfoSalas
            })
        }else{
           return res.json({
                status:409,
                data:returnedFromResponseAllInfoSalas
               })
        }

    }
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
 
   @Delete('turma/:id')
   async deleteTurmaById(
    @Param('id') turmaId:string ,
    @Body() {coordenadorId}:DeleteTurmaDto,
    @Res() res:Response
  
  ){

 
    try {
       
      // turmaId = turmaId.startsWith(':') ? turmaId.slice(1) : turmaId;

      const responseDeletedTurma = await this.coordenadorService.deleteTurmaById({
        turmaId:turmaId,
        coordenadorId:coordenadorId
      })

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




}