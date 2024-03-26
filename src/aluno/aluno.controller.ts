import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put, Request  } from "@nestjs/common";
import {  Response, response } from "express";
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { AlunoCreateDto } from "./dto/create-aluno.dto";
import { AlunoService } from "./aluno.service";




@IsPublic()
@Controller('aluno')
export class AlunoController{
    constructor(
        private readonly alunoService:AlunoService 
        ){}

    @Post('post')
    async create(@Body() alunoCreateDto:AlunoCreateDto , @Res() res:Response){

     const createdAluno = await this.alunoService.create(alunoCreateDto);
    
     return res.json({
      message:'Requisition sucesfully',
      createdAluno: createdAluno     
     })

    }


    @IsPublic()
    @Get('data')
    async getUser(@Req() req){

     const authAluno = req.headers.authorization;

     const token = authAluno && authAluno.split(' ')[1];


    const aluno = await this.alunoService.findAlunoBySub(token);

    console.log(token);


    if(token){
        return {
           status:202,
           aluno:aluno
        }
   }else{
     return{
        status:403
     }
   }

    }





 
}