import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

import { KoGPTResponse } from './response.type';

@Injectable()
export class KoGPTService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
  ) {
    super(aiChatService);

    this.serviceURL =
      'https://api.kakaobrain.com/v1/inference/kogpt/generation';

    this.init('KoGPT');
  }

  private async getMessage(prompt: string): Promise<KoGPTResponse> {
    const response = await axios.post<KoGPTResponse>(
      this.serviceURL,
      {
        prompt,
        max_tokens: 120,
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

    const chatMessage = (await this.getMessage(payload.text)) as KoGPTResponse;

    return {
      text: JSON.stringify(chatMessage.generations[0].text),
    };
  }
}
