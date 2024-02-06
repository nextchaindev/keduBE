import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as mime from 'mime';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import { ObjectDetectionResponse } from './response.type';

@Injectable()
export class ObjectDetectionService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    private cloudinary: CloudinaryService,
  ) {
    super(aiChatService);

    this.serviceURL = 'http://aiopen.etri.re.kr:8000/ObjectDetect';
    this.init('ObjectDetection');
  }

  private async getAnswer(
    type: string,
    file: string,
  ): Promise<ObjectDetectionResponse> {
    const requestJson = {
      argument: {
        type,
        file,
      },
    };

    const response = await axios.post<{
      return_object: ObjectDetectionResponse;
    }>(this.serviceURL, requestJson, {
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
    if (!attachFile) throw new Error('No file attached');

    const imageBase64 = Buffer.from(attachFile.buffer).toString('base64');
    const fileType = mime.getType(attachFile.originalname);

    const allowFormat = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp'];
    if (!allowFormat.includes(fileType))
      throw new Error('File type is not supported');

    const responseText = await this.getAnswer(fileType, imageBase64);

    return {
      text: JSON.stringify(responseText.data),
    };
  }
}
