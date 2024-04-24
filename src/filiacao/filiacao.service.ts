import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { filiacaoDto } from "src/dto/filiacao-dto.dto";
import { Filiacao } from "src/entities/filiacao.entity";
import { Prisma } from "@prisma/client";
import { DefaultDeserializer } from "v8";
@Injectable()
export class FiliacaoService{

  constructor(
    private readonly prisma:PrismaService
  ){}


  async createFiliacao(filiacaoDto:filiacaoDto):Promise<Filiacao|null>{



    const data:Prisma.filiacaoCreateInput = {
        username:filiacaoDto.username,
        tipo_Relacionamento:filiacaoDto.tipo_Relacionamento,
        telefone1:filiacaoDto.telefone1,
        telefone2:filiacaoDto.telefone2
     }
  
     const createdFiliacaoAluno = await this.prisma.filiacao.create({data});
     return createdFiliacaoAluno;

}


async findFiliacaoByAlunoId(idFiliacaoAluno:string):Promise<Filiacao|null>{

const filiacaoAluno = await this.prisma.filiacao.findUnique({where:{
    id:idFiliacaoAluno
}})


return filiacaoAluno
}





}