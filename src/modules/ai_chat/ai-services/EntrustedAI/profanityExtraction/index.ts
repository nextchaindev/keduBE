import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

import { ProfanityExtractionResponse } from './response.type';

@Injectable()
export class ProfanityExtractionService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
  ) {
    super(aiChatService);

    this.serviceURL = 'https://api.matgim.ai/54edkvw2hn/api-keyword-slang';
    this.init('SentimentExtraction');
  }

  private async getExtraction(
    document: string,
  ): Promise<ProfanityExtractionResponse> {
    const response = await axios.post<ProfanityExtractionResponse>(
      this.serviceURL,
      {
        document,
      },
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'x-auth-token': this.apiKey,
        },
      },
    );

    return response.data;
  }

  async sendMessage(payload: CreateMessageDto): Promise<any> {
    if (!payload.text) throw new Error('Text is required');

    const keywordExtract = (await this.getExtraction(payload.text)) as any;
    if (!keywordExtract.result.data.length)
      throw new Error('No recognized from AI');

    return {
      text: JSON.stringify(keywordExtract.result.data),
    };
  }
}
