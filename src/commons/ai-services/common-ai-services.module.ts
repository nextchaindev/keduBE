import { Module } from '@nestjs/common';

import { ModelsModule } from '@/models/models.module';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';

@Module({
  imports: [ModelsModule],
  controllers: [],
  providers: [AiChatService, ChatService],
})
export class CommonAiServicesModule {}
