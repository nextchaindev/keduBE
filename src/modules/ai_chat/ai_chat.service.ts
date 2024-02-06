import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { AIToolModel } from '@/models/ai_tool.model';
import { AITool } from '@/models/entities/ai_tool.entity';
import { UserModel } from '@/models/user.model';

import { ChatService } from '../chat/chat.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AiChatService {
  constructor(
    protected readonly userModel: UserModel,
    protected readonly chatService: ChatService,
    protected readonly aiToolModel: AIToolModel,
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
}
