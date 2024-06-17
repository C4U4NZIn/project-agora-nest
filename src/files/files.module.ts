import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma.module";
import { FilesService } from "./files.service";

@Module({
    imports:[PrismaModule],
    providers:[FilesService],
    exports:[FilesService]
})


export class FilesModule{}