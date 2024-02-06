import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

import { KarloResponse } from './response.type';

@Injectable()
export class KarloService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
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
    return imageGenerate.images;
  }
}
