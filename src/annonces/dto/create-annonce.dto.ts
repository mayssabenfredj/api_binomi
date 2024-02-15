import { IsString, IsNumber, IsArray, IsObject, IsDate } from 'class-validator';

export class CreateAnnonceDto {
  @IsString()
  title: string;
  @IsNumber()
  roomNumber: number;

  @IsNumber()
  placeInRoom: number;

  @IsNumber()
  placeDisponible: number;

  @IsArray()
  homeFacilities: string[];

  @IsObject()
  nearest: Record<string, any>;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  dateDisponibilite: string;

  @IsNumber()
  price: number;

  @IsString()
  user_id: string;
}
