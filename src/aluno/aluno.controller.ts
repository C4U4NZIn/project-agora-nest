import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put, Request  } from "@nestjs/common";
import {  Response, response } from "express";
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { AlunoCreateDto } from "./dto/CRUD-aluno.dto";
import { AlunoService } from "./aluno.service";
import { UpdateDtoAluno } from "./dto/CRUD-aluno.dto";
import { UpdateAvatarDto } from "./dto/CRUD-aluno.dto";



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
      @Post('updatePartial')
    async updateData(@Body() alunoUpdateDto:UpdateDtoAluno , @Res() res:Response){

        const responseUpdatedAluno = await this.alunoService.updateAlunoByParcialField(alunoUpdateDto);

         try {

            if(responseUpdatedAluno){
                res.json({
                    status:202,
                    updatedAlunoDataParcial:responseUpdatedAluno,
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
   async  deleteUserById(@Param('id') id:string , @Res() res:Response){
          const responseFromDeleteAlunoService = await this.alunoService.deleteAlunoById(id);

          try {
            if(responseFromDeleteAlunoService){
              res.json({
                status:202,
                message:"Requisição realizada com sucesso!",
                response:responseFromDeleteAlunoService
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

    @Post('update-avatar')
    async updateAvatar(@Body() updateAvatar:UpdateAvatarDto ,  @Res() res:Response){
      
  
        try {
          const resUpdateAvatarService = await this.alunoService.updateAlunoAvatar(updateAvatar);
          
          if(resUpdateAvatarService){
           return res.json({
            status:202,
            response:resUpdateAvatarService
           })
          }else{
            return res.json({
              status:403,
              response:resUpdateAvatarService
             })
          }


        } catch (error) {
          throw new Error(`${error}`);
        }

      }

 
  
}