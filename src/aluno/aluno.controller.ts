import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put, Request  } from "@nestjs/common";
import {  Response, response } from "express";
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { AlunoCreateDto } from "./dto/create-aluno.dto";
import { AlunoService } from "./aluno.service";




@IsPublic()
@Controller('aluno')
export class AlunoController{
    constructor(private readonly alunoService:AlunoService){}
    
    /**
     Foi colocado no controller do coordenador
         @Post('post')
         async create(@Body() alunoCreateDto:AlunoCreateDto , @Res() res:Response){
     
          const responseService = await this.alunoService.create(alunoCreateDto);
         
          return res.json({
           message:'Requisition sucesfully',
           ...responseService
          })
     
         }
     * 
     */

 
  
}