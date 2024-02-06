import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

import { CloudinaryService } from './../../../../cloudinary/cloudinary.service';

@Injectable()
export class DallEService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    protected readonly cloudinary: CloudinaryService,
  ) {
    super(aiChatService);

    this.init('Dall-E2');
  }

  async sendMessage(payload: CreateMessageDto): Promise<any> {
    if (!this.model) this.model = new OpenAI({ apiKey: this.apiKey });

    if (!payload.text) throw new Error('Text is required');
    const numberImage = 5;

    const imageGenerate = await this.model.images.generate({
      prompt: payload.text,
      n: numberImage,
      response_format: 'b64_json',
      size: '256x256',
    });

    const result = await Promise.all(
      imageGenerate.data.map((item: any) => {
        return this.cloudinary
          .uploadBase64ImageFile('data:image/jpeg;base64,' + item.b64_json)
          .then((res) => res.secure_url);
      }),
    );

    await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: payload.text,
      attach_url: JSON.stringify(result),
    });

    return result;
  }
}
