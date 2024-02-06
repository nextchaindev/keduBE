import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { NO_RESPONSE_FROM_AI } from '@/commons/const';
import { user_role } from '@/commons/role';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

import { KeywordExtractionResponse } from './response.type';

@Injectable()
export class ProperNounTopicExtractionService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
  ) {
    super(aiChatService);

    this.serviceURL = 'https://api.matgim.ai/54edkvw2hn/api-keyword-topic';
    this.init('ProperNounTopicExtraction');
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

    await this.aiChatService.saveMessage(payload);

    if (!keywordExtract.result.data.length) {
      await this.aiChatService.saveMessage({
        room_id: payload.room_id,
        text: JSON.stringify([
          {
            category: '',
            end_offset: '',
            start_offset: '',
            text: NO_RESPONSE_FROM_AI,
          },
        ]),
        role: user_role.BOT,
      });

      throw new Error('No recognized from AI');
    }

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: JSON.stringify(keywordExtract.result.data),
      role: user_role.BOT,
    });
  }
}
