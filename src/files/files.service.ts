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
@Injectable()
export class FilesService{

async getAllStudentsAccounts(fileStudentsAccounts:Express.Multer.File):Promise<any>{
 
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

 /**
  *

  */

 const students:AlunoCreateDto[] = plainToClass(
    AlunoCreateDto,
    StudentsAccountsData,
    {excludeExtraneousValues:false}
  )

  const validatorOptions:ValidatorOptions = {
    whitelist:true,
    skipMissingProperties:false,
    forbidUnknownValues:true,
    validationError:{
        target:false,
        value:false
    }
  }

  const errors = await validate(students , validatorOptions);

 console.log(errors);


 return StudentsAccountsData


}



}