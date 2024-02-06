import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { CreateMessageAIChatDto } from '@/modules/ai_chat/dto/send-message.dto';
import { ChatService } from '@/modules/chat/chat.service';

@Injectable()
export class SentenceParaphraseService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
  ) {
    super(aiChatService);

    this.serviceURL = 'http://aiopen.etri.re.kr:8000/ParaphraseQA';
    this.init('SentenceParapharse');
  }

  private async getAnswer(
    sentence1: string,
    sentence2: string,
  ): Promise<string> {
    const requestJson = {
      access_key: this.apiKey,
      argument: {
        sentence1,
        sentence2,
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

    return return_object;
  }

  async sendMessage(payload: CreateMessageAIChatDto): Promise<any> {
    if (!payload.sentence1 || !payload.sentence2)
      throw new Error('Missing fields. Sentence 1 and sentence 2 are required');

    const responseText = (await this.getAnswer(
      payload.sentence1,
      payload.sentence2,
    )) as any;

    return {
      text: responseText.result,
    };
  }
}
