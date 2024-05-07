import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put  } from "@nestjs/common";
import { Request, Response, response } from "express";
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { CoordenadorService } from "./coordenador.service";
import { CoordenadorCreateDto } from "./dto/create-coordenador.dto";
import { AlunoCreateDto } from "src/aluno/dto/create-aluno.dto";
import { ProfessorService } from "src/professor/professor.service";
import { AlunoService } from "src/aluno/aluno.service";
import { ProfessorCreateDto } from "src/professor/dto/create-professor.dto";
import { CreateTurmaDto } from "./dto/create-turma.dto";
import { AllTurmasDto } from "./dto/findAllTurmas-dto.dto";
import { CreateSala } from "./dto/create-sala.dto";
import { SalasAlunosDto } from "./dto/create-alunoSalas.dto";
import { UpdateCoordenadorDto } from "./dto/update-coordenador.dto";
import { GetAllSalasDto } from "./dto/getAllSalas.dto";


@IsPublic()
@Controller('coordenador')
export class CoordenadorController{
    constructor(
        private readonly coordenadorService:CoordenadorService,
        private readonly professorService:ProfessorService,
        private readonly alunoService:AlunoService

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
   @Post('sala')
   async createSala(@Body() createSalaDto:CreateSala , @Res() res:Response){
    
     const response = await this.coordenadorService.createSala(createSalaDto);


     return res.status(201).json({
         ...response
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

    @Delete(':id')
    async deleteCoordenador(@Param(':id') id:string , @Res() res:Response){
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
    @Post('getAllSalas')
    async getAllSalasByAlunoId(@Body() getAllSalasByAlunoIdDto:GetAllSalasDto , @Res() res:Response){

        const returnedFromRespooseAllInfoSalas = await this.coordenadorService.getAllSalasByAlunoId(getAllSalasByAlunoIdDto);
       
        if(returnedFromRespooseAllInfoSalas){
          return  res.json({
             status:202,
            data:returnedFromRespooseAllInfoSalas
            })
        }else{
           return res.json({
                status:409,
                data:returnedFromRespooseAllInfoSalas
               })
        }

    }


}