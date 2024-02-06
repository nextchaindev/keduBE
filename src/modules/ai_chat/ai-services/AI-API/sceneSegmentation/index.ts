import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { user_role } from '@/commons/role';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import {
  SceneSegmentStatusResponse,
  SceneSegmentUploadResponse,
} from './response.type';

@Injectable()
export class SceneSegmentationService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    private cloudinary: CloudinaryService,
  ) {
    super(aiChatService);

    this.serviceURL = 'http://aiopen.etri.re.kr:8000/VideoParse';
    this.init('SceneSegmentation');
  }

  private async uploadToAiServer(
    videoFilePath: string,
  ): Promise<SceneSegmentUploadResponse> {
    const response = await fetch(videoFilePath);

    const videoData = await response.arrayBuffer();
    const videoBlob = new Blob([videoData], { type: 'video/mp4' });

    const requestJson = {
      argument: {},
    };

    const form = new FormData();

    form.append('json', JSON.stringify(requestJson));
    form.append('uploadfile', videoBlob, 'video.mp4');

    const responseFile = await axios.post(this.serviceURL, form, {
      headers: {
        'Content-Type': `multipart/form-data;`,
        Authorization: this.apiKey,
      },
    });

    return responseFile.data;
  }

  private async getAnswer(fileId: string): Promise<SceneSegmentStatusResponse> {
    const requestJson = {
      request_id: 'reserved field',
      argument: {
        file_id: fileId,
      },
    };

    const response = await axios.post<{
      return_object: SceneSegmentStatusResponse;
    }>(`${this.serviceURL}/status`, requestJson, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: this.apiKey,
      },
    });

    const { return_object } = response.data;
    return return_object;
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

    payload.attach_url = attachUrl;

    const videoFileUpload = await this.uploadToAiServer(attachUrl);

    const responseText = await this.getAnswer(
      videoFileUpload.return_object.file_id,
    );

    await this.aiChatService.saveMessage(payload);

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: JSON.stringify(responseText.result),
      attach_url: attachUrl,
      role: user_role.BOT,
    });
  }
}
