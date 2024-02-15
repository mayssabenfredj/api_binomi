import {IsNotEmpty, IsString } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
    public  password:string;
    
    @IsNotEmpty()
    @IsString()
    public  newPassword:string;

}