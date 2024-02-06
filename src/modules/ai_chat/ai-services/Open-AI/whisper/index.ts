import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { user_role } from '@/commons/role';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import { CreateMessageWhisperDto, languageCode } from './response.type';

@Injectable()
export class WhisperService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    private cloudinary: CloudinaryService,
  ) {
    super(aiChatService);
    this.init('Whisper');
  }

  async sendMessage(
    payload: CreateMessageWhisperDto,
    attachFile?: Express.Multer.File,
  ): Promise<any> {
    if (!this.model) this.model = new OpenAI({ apiKey: this.apiKey });

    const attachUrl = attachFile
      ? await this.cloudinary
          .uploadFile(attachFile)
          .then((res) => res.secure_url)
      : payload.attach_url;

    payload.attach_url = attachUrl;

    const FileLike = {
      url: attachUrl,
      async blob() {
        return await fetch(this.url).then((r) => r.blob());
      },
    };

    const transcription = await this.model.audio.transcriptions.create({
      file: FileLike,
      model: 'whisper-1',
      language: payload.language_code,
    });

    await this.aiChatService.saveMessage(payload);

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: transcription.text,
      role: user_role.BOT,
    });
  }

  async getLanguageCode() {
    return languageCode;
  }
}
