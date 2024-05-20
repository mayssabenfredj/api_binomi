import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Message.name) private message: Model<Message>) {}

  async sendMessage(createMessageDto: CreateMessageDto) {
    const { senderId, receiverId, content } = createMessageDto;
    const message = new this.message({ senderId, receiverId, content });
    return await message.save();
  }

  async getMessages(senderId: string, receiverId: string): Promise<Message[]> {
    return await this.message
      .find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      })
      .sort({ timestamp: 'asc' })
      .exec();
  }
  create(createChatDto: CreateChatDto) {
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
