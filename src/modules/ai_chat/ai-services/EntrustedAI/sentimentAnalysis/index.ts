import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

import { SentimentAnalysisResponse } from './response.type';

@Injectable()
export class SentimentAnalysisService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
  ) {
    super(aiChatService);

    this.serviceURL = 'https://api.matgim.ai/54edkvw2hn/api-sentiment';
    this.init('SentimentAnalysis');
  }

  private async getKeywordAnalysis(
    document: string,
  ): Promise<SentimentAnalysisResponse> {
    const response = await axios.post<SentimentAnalysisResponse>(
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

    const keywordAnalysis = (await this.getKeywordAnalysis(
      payload.text,
    )) as any;
    if (!keywordAnalysis.result) throw new Error('No result from AI');

    return {
      text: JSON.stringify(keywordAnalysis.result),
    };
  }
}
