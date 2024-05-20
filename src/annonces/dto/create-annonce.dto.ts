import { IsString, IsNumber, IsArray, IsObject, IsDate } from 'class-validator';

export class CreateAnnonceDto {
  @IsString()
  title: string;

  @IsString()
  type: string;

  @IsString()
  gender: string;

  
  roomNumber: number;

  
  placeInRoom: number;

  
  placeDisponible: number;

  
  homeFacilities: string[];

  
  nearest: string[];

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  dateDisponibilite: string;

  
  price: number;

  @IsString()
  user_id: string;
}
