import { Module } from "@nestjs/common";

import { PrismaService } from "src/prisma.service";
import { PrismaModule } from "src/prisma.module";
import { CoordenadorController } from "./coordenador.controller";
import { CoordenadorService } from "./coordenador.service";
//import { AuthModule } from "src/Auth/auth.module";


@Module({
    imports:[PrismaModule],
    providers:[CoordenadorService],
    controllers:[CoordenadorController],
    exports:[CoordenadorService],
})

export class CoordenadorModule{}