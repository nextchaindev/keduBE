import { Injectable } from '@nestjs/common';
import { IsNull, Not } from 'typeorm';

import { AIToolModel } from '@/models/ai_tool.model';
import { RoomModel } from '@/models/room.model';

import { SelectAIToolsDto } from './dto/select-ai-tool.dto';

@Injectable()
export class AiToolListService {
  constructor(
    private readonly aiToolModel: AIToolModel,
    private readonly roomModel: RoomModel,
  ) {}

  async getAvailbleAiTool() {
    return await this.aiToolModel.repository.find({
      where: {
        parent: Not(IsNull()),
        isPublished: true,
      },
    });
  }

  async createAiToolList(payload: SelectAIToolsDto) {
    const selectToolList = payload.ai_tool_id.map((aiToolId) => ({
      title: `Room ${aiToolId}`,
      aiTool: {
        id: aiToolId,
      },
    }));

    return this.roomModel.repository.save(selectToolList);
  }
}
