import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

@Injectable()
export class DallEService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
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
      response_format: 'url',
    });

    const result = imageGenerate.data.map((item: any) => {
      return {
        image: item.url,
      };
    });

    await {
      text: payload.text,
      attach_url: JSON.stringify(result),
    };

    return result;
  }
}
