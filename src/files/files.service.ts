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

async getAllStudentsAccounts(fileStudentsAccounts:Express.Multer.File):Promise<{
  status?:number;
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


 const students:AlunoCreateDto[] = StudentsAccountsData.map((student)=> plainToClass(AlunoCreateDto , student));

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

  if(errors.length > 0){
    const detailErrors = errors.map((error)=>({
      property:error.property,
      constraints:error.constraints
    }))
    console.log("Os erros de validação=>", detailErrors);
  }

  console.log(StudentsAccountsData);



 return {
  status:201,
  students:StudentsAccountsData
 }

}



}