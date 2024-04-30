import { User} from "src/entities/userTest.entity";

import {
    IsEmail,
    IsString,
    Matches,
    MinLength,
    MaxLength,
    IsUUID,
    IsNumber
  
  }  from 'class-validator'
import { Address } from "src/entities/address.entity";

export class addressDto extends Address {

   
   @IsString()
   cep:string;
   @IsString()
   numberHouse?:string;
   @IsString()
   bairro:string;
   @IsString()
   estado:string;
   @IsString()
   cidade:string;
   @IsString()
   country:string;
   @IsString()
   logradouro?:string;
   @IsString()
   complemento?:string;


}