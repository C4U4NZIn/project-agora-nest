import { Module } from "@nestjs/common";
import { FiliacaoService } from "./filiacao.service";
import { PrismaModule } from "src/prisma.module";




@Module({
    imports:[PrismaModule],
    exports:[FiliacaoService],
    providers:[FiliacaoService]
})
export class FiliacaoModule{}