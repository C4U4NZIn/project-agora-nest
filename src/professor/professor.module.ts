import { Module } from "@nestjs/common";
import { ProfessorController } from "./professor.controller";
import { PrismaService } from "src/prisma.service";
import { PrismaModule } from "src/prisma.module";
import { ProfessorService } from "./professor.service";
import { UserModule } from "src/user/user.module";
//import { AuthModule } from "src/Auth/auth.module";


@Module({
    imports:[PrismaModule, UserModule],
    providers:[ProfessorService],
    controllers:[ProfessorController],
    exports:[ProfessorService],
})

export class ProfessorModule{}