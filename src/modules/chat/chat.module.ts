import { Module } from '@nestjs/common';

import { AiChatModule } from '../ai_chat/ai_chat.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [AiChatModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
