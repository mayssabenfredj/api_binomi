import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schemas/message.schema';

@Module({
  imports: [
    
    MongooseModule.forFeature([
      {
        name: 'Message',
        schema: MessageSchema,
      },
    ]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
