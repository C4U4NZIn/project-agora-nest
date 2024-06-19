import { Injectable } from "@nestjs/common";
import { AlunoCreateDto } from "src/aluno/dto/CRUD-aluno.dto";
import * as XLSX from 'xlsx'
import {
    ValidatorOptions,
  validate
} from 'class-validator'
import {
  plainToClass
} from 'class-transformer'
import { ProfessorCreateDto } from "src/professor/dto/CRUD-professor.dto";
@Injectable()
export class FilesService{


//deixar o backend mais limpo depois

async getAllStudentsAccounts(fileStudentsAccounts:Express.Multer.File):Promise<{
  students?:AlunoCreateDto[]
}>{
 
    //le o arquivo
    const workBook:XLSX.WorkBook = XLSX.read(fileStudentsAccounts.buffer, {
    type:'buffer',
    cellDates:true,
    cellNF:false
   });

  const sheetName = workBook.SheetNames[0];
  const sheet:XLSX.WorkSheet = workBook.Sheets[sheetName];

  const StudentsAccountsData:AlunoCreateDto[] = XLSX.utils.sheet_to_json(sheet , {
    dateNF:'YYYY-MM-DD'
  })


 return {
  students:StudentsAccountsData
 }

}

async getAllTeachersAccounts(fileTeachersAccounts:Express.Multer.File):Promise<{
  teachers?:ProfessorCreateDto[]
}>{

  const workBook:XLSX.WorkBook = XLSX.read(fileTeachersAccounts.buffer, {
    type:'buffer',
    cellDates:true,
    cellNF:false
   });

  const sheetName = workBook.SheetNames[0];
  const sheet:XLSX.WorkSheet = workBook.Sheets[sheetName];

  const TeachersAccountsData:ProfessorCreateDto[] = XLSX.utils.sheet_to_json(sheet , {
    dateNF:'YYYY-MM-DD'
  })


 return {
  teachers:TeachersAccountsData
 }

}



}