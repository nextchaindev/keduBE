import { Injectable } from '@nestjs/common';
import { IsNull, Not } from 'typeorm';

import { AIToolModel } from '@/models/ai_tool.model';

@Injectable()
export class AiToolListService {
  constructor(private readonly aiToolModel: AIToolModel) {}

  async getAvailbleAiTool() {
    return await this.aiToolModel.repository.find({
      where: {
        parent: Not(IsNull()),
        isPublished: true,
      },
    });
  }
}
