
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsArray,
  IsObject,
} from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
 gender : string

  @IsOptional()
  @IsObject()
  address: object;

  @IsOptional()
  @IsString()
  cin: string;

  @IsOptional()
  @IsArray()
  hobbies: string[];

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  sickness: string;

  @IsString()
  role: string;

 
}