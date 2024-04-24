import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Prisma } from "@prisma/client";
import { addressDto } from "src/dto/address-dto.dto";
import { Address } from "src/entities/address.entity";

@Injectable()
export class AddressService{

constructor(
    private readonly prisma:PrismaService
){}


async findAddressByAlunoId(alunoId:string , addresId:string):Promise<Address|null>{
    return null

}
}