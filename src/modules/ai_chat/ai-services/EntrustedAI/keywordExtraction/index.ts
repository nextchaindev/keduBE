import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { NO_RESPONSE_FROM_AI } from '@/commons/const';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

import { KeywordExtractionResponse } from './response.type';

@Injectable()
export class KeywordExtractionService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
  ) {
    super(aiChatService);

    this.serviceURL = 'https://api.matgim.ai/54edkvw2hn/api-keyword';

    this.init('KeywordExtraction');
  }

  private async getExtraction(
    document: string,
  ): Promise<KeywordExtractionResponse> {
    const response = await axios.post<KeywordExtractionResponse>(
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

    if (!keywordExtract.result.keywords.length) {
      await this.aiChatService.saveMessage({
        room_id: payload.room_id,
        text: JSON.stringify([[NO_RESPONSE_FROM_AI, 0]]),
      });

      throw new Error('No recognized from AI');
    }

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: JSON.stringify(keywordExtract.result.keywords),
    });
  }
}
