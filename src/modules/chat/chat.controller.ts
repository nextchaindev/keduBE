import { Controller, Get, Param } from '@nestjs/common';

import { IsPublicEndpoint } from '@/commons/decorators';

import { AiChatService } from '../ai_chat/ai_chat.service';
import { ChatRoomParams } from '../ai_chat/dto/get-chat.param';

@IsPublicEndpoint()
@Controller('chat')
export class ChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Get('/:roomId')
  async getMessages(@Param() param: ChatRoomParams) {
    return this.aiChatService.getMessages(param.roomId);
  }
}
