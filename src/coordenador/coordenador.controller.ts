import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put  } from "@nestjs/common";
import { Request, Response, response } from "express";
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { CoordenadorService } from "./coordenador.service";
import { CoordenadorCreateDto } from "./dto/create-coordenador.dto";
import { AlunoCreateDto } from "src/aluno/dto/create-aluno.dto";
import { ProfessorService } from "src/professor/professor.service";
import { AlunoService } from "src/aluno/aluno.service";
import { ProfessorCreateDto } from "src/professor/dto/create-professor.dto";


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



}