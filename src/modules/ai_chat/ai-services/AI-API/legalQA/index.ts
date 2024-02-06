import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

@Injectable()
export class LegalQAService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
  ) {
    super(aiChatService);

    this.serviceURL = 'http://aiopen.etri.re.kr:8000/LegalQA';
    this.init('LegalQA');
  }

  private async getAnswer(question: string): Promise<string> {
    const requestJson = {
      access_key: this.apiKey,
      argument: {
        question,
      },
    };

    const response = await axios.post<{ return_object: any }>(
      this.serviceURL,
      requestJson,
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: this.apiKey,
        },
      },
    );

    const { return_object } = response.data;
    if (!return_object.LegalInfo.AnswerInfo.length)
      throw new Error('No recognized from AI');

    return return_object;
  }

  async sendMessage(payload: CreateMessageDto): Promise<any> {
    if (!payload.text) throw new Error('Text is required');

    const responseText = (await this.getAnswer(payload.text)) as any;

    return {
      text: JSON.stringify(responseText.LegalInfo.AnswerInfo),
    };
  }
}
