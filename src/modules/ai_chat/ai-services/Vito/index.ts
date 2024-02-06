import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import { VitoResponse, VitoUploadResponse } from './response.type';

@Injectable()
export class VitoService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    protected readonly cloudinary: CloudinaryService,
  ) {
    super(aiChatService);
    this.aiChatService = aiChatService;

    this.serviceURL = 'https://openapi.vito.ai/v1';
    this.init('Vito');
  }

  private async authentication(): Promise<string> {
    const form = new FormData();
    form.append('client_id', 'GsvVAzmA68D_Tr0epP9J');
    form.append('client_secret', 'cNfSwuKuI3GNELttiLroywbnlj81U2Is8JQHDpBg');

    const response = await axios.post<{
      access_token: string;
      expires_in: number;
    }>(`${this.serviceURL}/authenticate`, form, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = response.data;
    this.apiKey = access_token;

    return access_token;
  }

  private async uploadToAiServer(
    audioFile: Express.Multer.File,
  ): Promise<VitoUploadResponse> {
    const audioData = await audioFile.buffer;
    const audioBlob = new Blob([audioData], { type: 'audio/mp3' });

    const requestJson = {
      use_itn: true,
    };

    const form = new FormData();

    form.append('config', JSON.stringify(requestJson));
    form.append('file', audioBlob, 'audio.mp3');

    const responseFile = await axios.post(
      `${this.serviceURL}/transcribe`,
      form,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
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
          Authorization: `Bearer ${this.apiKey}`,
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
    await this.authentication();

    const documentFileUpload = await this.uploadToAiServer(attachFile);
    const transcription = await this.getTranscript(documentFileUpload.id);

    return {
      text: JSON.stringify(transcription.results.utterances),
    };
  }
}
