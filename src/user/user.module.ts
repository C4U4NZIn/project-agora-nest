import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { PrismaService } from "src/prisma.service";
import { PrismaModule } from "src/prisma.module";
//import { AuthModule } from "src/Auth/auth.module";


@Module({
    imports:[PrismaModule],
    providers:[UserService],
    controllers:[UserController],
    exports:[UserService],
})

export class UserModule{}