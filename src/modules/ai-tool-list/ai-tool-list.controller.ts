import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '@/commons/decorators';

import { AiToolListService } from './ai-tool-list.service';

@ApiTags('/ai-tool-list')
@IsPublicEndpoint()
@Controller('ai-tool-list')
export class AiToolListController {
  constructor(private readonly aiToolListService: AiToolListService) {}

  @Get('/')
  async getAvailbleAiTool() {
    return await this.aiToolListService.getAvailbleAiTool();
  }
}
