import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
