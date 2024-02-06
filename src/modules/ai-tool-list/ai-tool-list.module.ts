import { Module } from '@nestjs/common';

import { ModelsModule } from '@/models/models.module';

import { AiToolListController } from './ai-tool-list.controller';
import { AiToolListService } from './ai-tool-list.service';

@Module({
  imports: [ModelsModule],
  controllers: [AiToolListController],
  providers: [AiToolListService],
})
export class AiToolListModule {}
