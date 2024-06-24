import { Injectable } from "@nestjs/common"
import { AlunoId } from "../dto/create-alunoSalas.dto"
import { AlunoService } from "src/aluno/aluno.service"
import { PrismaService } from "src/prisma.service"
import { CoordenadorService } from "../coordenador.service"
import { CreateTurmaDto, DeleteTurmaDto } from "../dto/CRUD-turma.dto"
import * as bcrypt from 'bcrypt'


@Injectable()
export class VerifyUsersExistenceService{
    constructor(
      private readonly prisma:PrismaService,
     
    ){}



  async verifyAllStudentsExistence(alunosId:AlunoId[]):Promise<{
    isValid:boolean,
    studentsArray:any
  }>{
         
    let verifyCurrentAlunoId = []


    const AllStudentsAlreadyExists = await Promise.all(alunosId.map(
        async (alunoId)=>{
        const currentAlunoId =  await this.prisma.aluno.findUnique({
                where:{
                    id:alunoId.alunoId
                }
            })
         if(!currentAlunoId){
            verifyCurrentAlunoId.push(false)
         }else{
            verifyCurrentAlunoId.push(true)
         }
         return currentAlunoId

      }))
 
    



     return {
        isValid:!verifyCurrentAlunoId.includes(false),
        studentsArray:AllStudentsAlreadyExists
        
     }

  }


  async verifyTeacherExistenceById(professorId:string):Promise<
  {
    isExist:boolean
  }
  >{

    try {

         const isTeacherExist = await this.prisma.professor.findUnique({
            where:{
                id:professorId
            }
         }) 

        if(!isTeacherExist){
            return {
            isExist:false
             }
        }else{
            return{
                isExist:true
            }
        }
    } catch (error) {
        throw new Error(`${error}`)
    }



  }


 async verifyCoordenadorPassword({coordenadorPassword , coordenadorId}:DeleteTurmaDto):Promise<{
    isAuthorized:boolean
 }>{

    try {
        const coordenadorToVerifyPassword = await this.prisma.coordenador.findUnique({
          where:{
            id:coordenadorId
          }
        })
        const isCorrectCoordenadorPassword = await bcrypt.compare(coordenadorPassword , coordenadorToVerifyPassword.password);
        if(!coordenadorToVerifyPassword){
            return {
             isAuthorized:false
            }        
        }

      if(!isCorrectCoordenadorPassword){
        return {
            isAuthorized:false
           }        
      }

      return{
        isAuthorized:true
      }

    
    } catch (error) {
        throw new Error(`${error}`)
    }

 }


 async verifyCoordenadorExistence({idCoordenador}:CreateTurmaDto):Promise<
  {
    isExistCoordenador:boolean
  }
 >{
     try {
       
      const isExistCoordenador = await this.prisma.coordenador.findUnique({
        where:{
          id:idCoordenador
        }
      })

      if(!isExistCoordenador){
        return{
          isExistCoordenador:false
        }
      }

      
      return{
        isExistCoordenador:true
      }

     } catch (error) {
       throw new Error(`${error}`);
     }
 }


}