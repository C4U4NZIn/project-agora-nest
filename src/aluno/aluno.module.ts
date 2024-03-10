import { Module } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { PrismaModule } from "src/prisma.module";
import { AlunoService } from "./aluno.service";
import { AlunoController } from "./aluno.controller";
//import { AuthModule } from "src/Auth/auth.module";


@Module({
    imports:[PrismaModule],
    providers:[AlunoService],
    controllers:[AlunoController],
    exports:[AlunoService],
})

export class AlunoModule{}