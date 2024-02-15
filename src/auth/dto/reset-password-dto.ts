import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {

    @IsNotEmpty()
    @IsString()
    public  password:string;
    
}