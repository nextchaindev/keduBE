import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

@Injectable()
export class OpenAIService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
  ) {
    super(aiChatService);

    this.aiChatService = aiChatService;
    this.init('GPTTurbo');
  }

  async sendMessage(payload: CreateMessageDto) {
    if (!this.model) this.model = new OpenAI({ apiKey: this.apiKey });
    await this.aiChatService.saveMessage(payload);

    const oldMessages = await this.aiChatService.getMessages(payload.room_id);

    const messages = oldMessages
      .map((message, index) => ({
        role: index % 2 === 0 ? 'user' : 'assistant',
        content: message?.text || '',
      }))
      .splice(-10) as Array<ChatCompletionMessageParam>;

    const completion = await this.model.chat.completions.create({
      messages: messages,
      model: 'gpt-3.5-turbo',
    });

    const replyMsg = completion.choices[0].message.content as string;

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: replyMsg,
    });
  }
}
