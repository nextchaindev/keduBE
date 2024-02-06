import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { user_role } from '@/commons/role';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import { CreateMessageClovaDto } from './response.type';
import { speaker } from './speaker.data';

@Injectable()
export class ClovaService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    private cloudinary: CloudinaryService,
  ) {
    super(aiChatService);

    this.serviceURL =
      'https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts';

    this.init('Clova');
  }

  private async getSpeech(payload: CreateMessageClovaDto): Promise<string> {
    const formData = new FormData();

    formData.append('speaker', payload.speaker);
    formData.append('speed', payload.speed);
    formData.append('alpha', payload.alpha);
    formData.append('text', payload.text);
    formData.append('volume', payload.volume || 0);
    formData.append('pitch', payload.pitch);
    formData.append('end-pitch', payload.end_pitch);
    formData.append('emotion', payload.emotion);
    formData.append('emotion-strength', payload.emotion_strength);
    formData.append('format', 'mp3');

    const response = await axios.post(this.serviceURL, formData, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': this.apiKeyId,
        'X-NCP-APIGW-API-KEY': this.apiKey,
      },
      responseType: 'arraybuffer',
    });

    const base64String = btoa(
      new Uint8Array(response.data).reduce(function (data, byte) {
        return data + String.fromCharCode(byte);
      }, ''),
    );

    return base64String;
  }

  async sendMessage(payload: CreateMessageClovaDto): Promise<any> {
    const responseText = await this.getSpeech(payload);

    const audioUrl = await this.cloudinary
      .uploadBase64ImageFile('data:audio/mp3;base64,' + responseText)
      .then((res) => res.secure_url);

    await this.aiChatService.saveMessage(payload);

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      attach_url: audioUrl,
      role: user_role.BOT,
    });
  }

  async getSpeaker() {
    return speaker;
  }
}
