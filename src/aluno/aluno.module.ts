import { Module } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { PrismaModule } from "src/prisma.module";
import { AlunoService } from "./aluno.service";
import { AlunoController } from "./aluno.controller";
import { JwtService } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { AddressModule } from "src/address/address.module";
import { FiliacaoModule } from "src/filiacao/filiacao.module";
//import { AuthModule } from "src/Auth/auth.module";


@Module({
    imports:[PrismaModule , UserModule , AddressModule , FiliacaoModule],
    providers:[AlunoService],
    controllers:[AlunoController],
    exports:[AlunoService],
})

export class AlunoModule{}