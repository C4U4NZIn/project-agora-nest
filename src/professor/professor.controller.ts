import { Controller , Get, Post, Delete ,Patch,Body, Req , Res,Param, Put  } from "@nestjs/common";
import { Request, Response, response } from "express";
import { UserService } from '../user/user.service'
import { UserCreateDto } from '../dto/create-user.dto'
import { IsPublic } from '../Auth/decorators/is-public.decorator';
import { ProfessorCreateDto } from "./dto/CRUD-professor.dto";
import { ProfessorService } from "./professor.service";
import { UpdateProfessorDto } from "./dto/update-professor.dto";
import { UpdateProfessorAvatarDto } from "./dto/CRUD-professor.dto";
@IsPublic()
@Controller('professor')
export class ProfessorController{
    constructor(private readonly professorService:ProfessorService){}

    /**
     * foi colocado no controller do coordenador
     @Post('post')
     async create(@Body() profCreateDto:ProfessorCreateDto , @Res() res:Response){
      const responseService = await this.professorService.create(profCreateDto);
      return res.json({
       message:'Requisition sucesfully',
      ...responseService 
      })
     }
     * 
     */
 
     @Post('updatePartial')
     async updateProfessor(@Body() professorUpdateDto:UpdateProfessorDto , @Res() res:Response){
        const responseUpdatedProfessor = await this.professorService.updateProfessorByParcialField(professorUpdateDto);

        try {

           if(responseUpdatedProfessor){
               res.json({
                   status:202,
                   updatedAlunoDataParcial:responseUpdatedProfessor,
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
 

     //isso daqui realmente vai mudar - pq só o coordenador pode excluir o aluno e/o professor
     //ent vou ter que tirar aquele componente de exclude e substituir pelo de alterar imagem no front end
     @Delete(':id')
     async deleteProfessor(@Param(':id') id:string , @Res() res:Response){
        const responseFromDeleteProfessorService = await this.professorService.deleteProfessorById(id);

        try {
          if(responseFromDeleteProfessorService){
            res.json({
              status:202,
              message:"Requisição realizada com sucesso!",
              response:responseFromDeleteProfessorService
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

     //update avatar from
     @Post("update-avatar")
     async updateProfessorAvatar(@Body() updateProfessorAvatar:UpdateProfessorAvatarDto , @Res() res:Response){
      try {
        const resUpdatedAvatarProfessor =  await this.professorService.updateProfessorAvatar(updateProfessorAvatar);
        
       if(resUpdatedAvatarProfessor){
         res.json({
           ...resUpdatedAvatarProfessor
         })
       }

      } catch (error) {
        throw new Error(`${error}`);
      }
     }



}