import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { user_role } from '@/commons/role';
import { AIToolModel } from '@/models/ai_tool.model';
import { AITool } from '@/models/entities/ai_tool.entity';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { UserModel } from '@/models/user.model';

import { ChatService } from '../chat/chat.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateMessageAIChatDto } from './dto/send-message.dto';

@Injectable()
export class AiChatService {
  constructor(
    protected readonly userModel: UserModel,
    protected readonly chatService: ChatService,
    protected readonly aiToolModel: AIToolModel,
    protected readonly roomModel: RoomModel,
    protected readonly messageModel: MessageModel,
    protected readonly cloudinary: CloudinaryService,
  ) {}

  public getAITool(serviceName: string): Promise<AITool | null> {
    if (!serviceName)
      throw new HttpException(
        'This AI service does not exist',
        HttpStatus.NOT_FOUND,
      );

    const apiKey = this.aiToolModel.repository
      .findOne({
        where: { key: serviceName },
        select: {
          ...this.aiToolModel.repository.metadata.columns.reduce(
            (prev, curr) => ({
              ...prev,
              [curr.propertyName]: true,
            }),
            {},
          ),
        },
      })
      .then((res) => {
        return res;
      });

    return apiKey;
  }

  async getMessages(roomId: string) {
    const room = await this.roomModel.repository.find({
      where: { id: roomId },
    });

    if (!room) throw new BadRequestException('Room not found');

    const messages = await this.messageModel.repository.find({
      where: { room: { id: roomId } },
      order: { created_at: 'ASC' },
    });

    const userMessage = messages.map((message) => {
      return {
        ...message,
        user: {
          role: message.role,
        },
      };
    });

    return userMessage;
  }

  public async saveMessage(payload: CreateMessageAIChatDto): Promise<any> {
    const room = await this.roomModel.repository.findOne({
      where: { id: payload.room_id },
    });

    if (!room) throw new BadRequestException('Room not found');

    return await this.messageModel.repository.save({
      room: {
        id: payload.room_id,
      },
      text: payload.text,
      attachUrl: payload.attach_url,
      language_code: payload.language_code,
      sentence1: payload.sentence1,
      sentence2: payload.sentence2,
      role: payload.role || user_role.USER,
    });
  }
}
