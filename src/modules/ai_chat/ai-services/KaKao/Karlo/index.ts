import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import { KarloResponse } from './response.type';

@Injectable()
export class KarloService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    protected readonly cloudinary: CloudinaryService,
  ) {
    super(aiChatService);

    this.serviceURL = 'https://api.kakaobrain.com/v2/inference/karlo/t2i';

    this.init('Karlo');
  }

  private async getImages(prompt: string): Promise<KarloResponse> {
    const response = await axios.post<KarloResponse>(
      this.serviceURL,
      {
        prompt,
        samples: 6,
        return_type: 'base64_string',
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `KakaoAK ${this.apiKey}`,
        },
      },
    );

    return response.data;
  }

  async sendMessage(payload: CreateMessageDto): Promise<any> {
    if (!payload.text) throw new Error('Text is required');

    const imageGenerate = (await this.getImages(payload.text)) as KarloResponse;

    await this.aiChatService.saveMessage(payload);

    const result = await Promise.all(
      imageGenerate.images.map((item: any) => {
        return this.cloudinary
          .uploadBase64ImageFile('data:image/jpeg;base64,' + item.image)
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
