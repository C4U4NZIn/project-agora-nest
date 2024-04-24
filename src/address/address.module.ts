import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma.module";
import { AddressService } from "./address.service";


@Module({
    imports:[PrismaModule],
    exports:[AddressService],
    providers:[AddressService]
})
export class AddressModule{}
