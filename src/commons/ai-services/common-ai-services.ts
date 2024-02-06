import { Injectable } from '@nestjs/common';

import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';

export class BotData {
  id: string;
  modelName: string;

  constructor(id: string, modelName: string) {
    this.id = id;
    this.modelName = modelName;
  }
}

export type StaticThis<T> = { new (): T };

@Injectable()
export class CommonAIServices {
  public static providerName: string;

  apiKey: string;
  apiKeyId: string;
  serviceURL: string;
  organizationKey: string;
  model: any;
  botId: string;

  constructor(protected readonly aiChatService: AiChatService) {}

  static async run<T extends CommonAIServices, R>(
    this: StaticThis<T>,
    callbackFn: (crawler: CommonAIServices) => Promise<R>,
  ) {
    const agent = new this();
    return await callbackFn(agent);
  }

  async init(modelName: string) {
    const aiModelInfo = await this.aiChatService.getAITool(modelName);
    if (!aiModelInfo?.name)
      throw new Error(`AI Tool ${modelName} is not registered`);

    if (!aiModelInfo.apiKey)
      throw new Error(`API Key is not registered for ${modelName}`);

    this.apiKey = aiModelInfo.apiKey as string;
    this.apiKeyId = aiModelInfo.apiKeyId as string;
    CommonAIServices.providerName = modelName;

    return this;
  }

  async getApiKey(modelName: string) {}

  async sendMessage(payload: CreateMessageDto): Promise<any> {}
}
