import { Module } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { PrismaModule } from "src/prisma.module";
import { AlunoService } from "./aluno.service";
import { AlunoController } from "./aluno.controller";
import { JwtAlunoStrategy } from "src/AuthAluno/stratagies/jwtAluno.strategy";
import { JwtService } from "@nestjs/jwt";
//import { AuthModule } from "src/Auth/auth.module";


@Module({
    imports:[PrismaModule],
    providers:[AlunoService , JwtService],
    controllers:[AlunoController],
    exports:[AlunoService],
})

export class AlunoModule{}