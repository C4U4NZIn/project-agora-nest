import { IsString, IsUUID } from "class-validator";
import { userOtp } from "../otpEntity/otpEntity.entity";

export class otpDto extends userOtp {
    @IsUUID()
    id: string;
    @IsString()
    currentCode: string;
}