import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put  } from "@nestjs/common";
import { Request, Response, response } from "express";
import { UserService } from '../user/user.service'
import { UserCreateDto } from '../dto/create-user.dto'
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { ProfessorCreateDto } from "./dto/create-professor.dto";
import { ProfessorService } from "./professor.service";


@IsPublic()
@Controller('professor')
export class ProfessorController{
    constructor(private readonly professorService:ProfessorService){}

    @Post('post')
    async create(@Body() profCreateDto:ProfessorCreateDto , @Res() res:Response){

     const responseService = await this.professorService.create(profCreateDto);
    
     return res.json({
      message:'Requisition sucesfully',
      professor:responseService.professor,
      user:responseService.user     
     })

    }
 
}