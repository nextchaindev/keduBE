import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { IsPublicEndpoint } from '@/commons/decorators';

import { AiToolListService } from './ai-tool-list.service';
import { SelectAIToolsDto } from './dto/select-ai-tool.dto';

@ApiTags('/ai-tool-list')
@IsPublicEndpoint()
@Controller('ai-tool-list')
export class AiToolListController {
  constructor(private readonly aiToolListService: AiToolListService) {}

  @Get('/')
  async getAvailbleAiTool() {
    return await this.aiToolListService.getAvailbleAiTool();
  }

  @Post('/')
  async createAiToolList(@Body() payload: SelectAIToolsDto) {
    return await this.aiToolListService.createAiToolList(payload);
  }
}
