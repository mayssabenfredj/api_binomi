import { IsString, IsOptional } from 'class-validator';


export class UpdateAuthDto  {
    @IsString()
    @IsOptional()
    clubName?: string;
  
    @IsString()
    @IsOptional()
    description?: string;
}
