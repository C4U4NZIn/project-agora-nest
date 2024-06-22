import { Injectable } from "@nestjs/common"
import { AlunoId } from "../dto/create-alunoSalas.dto"
import { AlunoService } from "src/aluno/aluno.service"
import { PrismaService } from "src/prisma.service"



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

}