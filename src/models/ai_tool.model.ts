import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModel } from 'src/commons/common.model';
import { Repository } from 'typeorm';

import { AITool } from './entities/ai_tool.entity';

@Injectable()
export class AIToolModel extends CommonModel {
  constructor(
    @InjectRepository(AITool)
    public repository: Repository<AITool>,
  ) {
    super();
  }
}
