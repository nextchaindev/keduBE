import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

@Injectable()
export class OpenAIService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
  ) {
    super(aiChatService);

    this.aiChatService = aiChatService;
    this.init('GPTTurbo');
  }

  async sendMessage(payload: CreateMessageDto) {
    if (!this.model) this.model = new OpenAI({ apiKey: this.apiKey });

    const completion = await this.model.chat.completions.create({
      messages: [
        {
          content: payload.text,
          role: 'user',
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const replyMsg = completion.choices[0].message.content as string;

    return {
      text: replyMsg,
    };
  }
}
