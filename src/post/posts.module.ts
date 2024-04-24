import { Module } from "@nestjs/common";
import { PostService } from "./posts.service";

@Module({
    exports:[PostService],
    providers:[PostService],
})
export class PostModule{}