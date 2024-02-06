import { HttpException, Injectable } from '@nestjs/common';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { NO_RESPONSE_FROM_AI } from '@/commons/const';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import {
  CreateMessageSpeechRecognitionDto,
  languageCode,
} from './response.type';

@Injectable()
export class SpeechRecognitionService extends CommonAIServices {
  constructor(
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    private cloudinary: CloudinaryService,
  ) {
    super(aiChatService);

    this.serviceURL = 'http://aiopen.etri.re.kr:8000/WiseASR/Recognition';

    this.init('SpeechRecognition');
  }

  private async getAnswer(language_code: string, audio: any): Promise<string> {
    const requestJson = {
      argument: {
        language_code,
        audio,
      },
    };

    const response = await fetch(this.serviceURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.apiKey,
      },
      body: JSON.stringify(requestJson),
    });

    const data = await response.json();
    if (data.result === -1) throw new HttpException(data.reason, 400);

    const { return_object } = data;

    return return_object;
  }

  async sendMessage(
    payload: CreateMessageSpeechRecognitionDto,
    attachFile?: Express.Multer.File,
  ): Promise<any> {
    if (!attachFile) throw new Error('No file attached');

    const attachUrl = attachFile
      ? await this.cloudinary
          .uploadFile(attachFile)
          .then((res) => res.secure_url)
      : payload.attach_url;

    payload.attach_url = attachUrl;
    payload.config = JSON.stringify({
      language_code: payload.language_code,
    });

    await this.aiChatService.saveMessage(payload);

    const transcription = (await this.getAnswer(
      payload.language_code,
      attachFile.buffer.toString('base64'),
    )) as any;

    if (transcription.recognized === '') {
      await this.aiChatService.saveMessage({
        room_id: payload.room_id,
        text: NO_RESPONSE_FROM_AI,
      });

      throw new Error('No recognized from AI');
    }

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: transcription.recognized,
    });
  }

  async getLanguageCode() {
    return languageCode;
  }
}
