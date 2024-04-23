import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put  } from "@nestjs/common";
import { Request, Response, response } from "express";
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { CoordenadorService } from "./coordenador.service";
import { CoordenadorCreateDto } from "./dto/create-coordenador.dto";




@IsPublic()
@Controller('coordenador')
export class CoordenadorController{
    constructor(private readonly coordenadorService:CoordenadorService){}

    @Post('post')
    async create(@Body() coordenadorCreateDto:CoordenadorCreateDto , @Res() res:Response){

     const response = await this.coordenadorService.create(coordenadorCreateDto);
    
     return res.json({
      message:'Requisition sucesfully',
      createdCoordenador: response.coordenador,
      createdUser:response.user,     
     })

    }



}