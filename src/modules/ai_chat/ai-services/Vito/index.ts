import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import streamifier from 'streamifier';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { user_role } from '@/commons/role';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import { VitoResponse, VitoUploadResponse } from './response.type';

@Injectable()
export class VitoService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    private cloudinary: CloudinaryService,
  ) {
    super(aiChatService);
    this.aiChatService = aiChatService;

    this.serviceURL = 'https://openapi.vito.ai/v1';

    this.init('Vito');
  }

  private async authentication(): Promise<string> {
    const form = new FormData();
    form.append('client_id', this.apiKeyId);
    form.append('client_secret', this.apiKey);

    const response = await axios.post<{
      access_token: string;
      expires_in: number;
    }>(`${this.serviceURL}/authenticate`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    this.organizationKey = access_token;

    return access_token;
  }

  private async uploadToAiServer(
    audioFilePath: Buffer,
  ): Promise<VitoUploadResponse> {
    const requestJson = {
      use_itn: true,
    };

    const form = new FormData();

    form.append('config', JSON.stringify(requestJson));
    form.append(
      'file',
      streamifier.createReadStream(audioFilePath),
      'audio.mp3',
    );

    const responseFile = await axios.post(
      `${this.serviceURL}/transcribe`,
      form,
      {
        headers: {
          Authorization: `Bearer ${this.organizationKey}`,
        },
      },
    );

    return responseFile.data;
  }

  private async getTranscript(id: string): Promise<VitoResponse> {
    const response = await axios.get<VitoResponse>(
      `${this.serviceURL}/transcribe/${id}`,
      {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: `Bearer ${this.organizationKey}`,
        },
      },
    );

    const { status } = response.data;

    return status == 'completed' ? response.data : await this.getTranscript(id);
  }
  async sendMessage(
    payload: CreateMessageDto,
    attachFile?: Express.Multer.File,
  ): Promise<any> {
    const attachUrl = attachFile
      ? await this.cloudinary
          .uploadFile(attachFile)
          .then((res) => res.secure_url)
      : payload.attach_url;

    if (!attachFile) throw new Error('File is required');

    payload.attach_url = attachUrl;

    await this.authentication();

    const documentFileUpload = await this.uploadToAiServer(attachFile?.buffer);
    const transcription = await this.getTranscript(documentFileUpload.id);

    await this.aiChatService.saveMessage(payload);

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: JSON.stringify(transcription.results.utterances),
      role: user_role.BOT,
    });
  }
}
