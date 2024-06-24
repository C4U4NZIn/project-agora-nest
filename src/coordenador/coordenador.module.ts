import { Module } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { PrismaModule } from "src/prisma.module";
import { CoordenadorController } from "./coordenador.controller";
import { CoordenadorService } from "./coordenador.service";
import { UserModule } from "src/user/user.module";
import { AlunoModule } from "src/aluno/aluno.module";
import { ProfessorModule } from "src/professor/professor.module";
//import { AuthModule } from "src/Auth/auth.module";
import { FilesModule } from "src/files/files.module";
import { VerifyUsersExistenceService } from "./functions/coordenadorFunctions";
//import { VerifyUsersExistenceModule } from "./functions/coordenadorFunctions.module";

@Module({
    imports:[PrismaModule, UserModule , AlunoModule , ProfessorModule , FilesModule],
    providers:[CoordenadorService , VerifyUsersExistenceService],
    controllers:[CoordenadorController],
    exports:[CoordenadorService],
})

export class CoordenadorModule{}