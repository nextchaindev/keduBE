import { Injectable } from '@nestjs/common';
import axios from 'axios';
import mineType from 'mime-types';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { user_role } from '@/commons/role';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CreateMessageDto } from '@/modules/chat/dto/send-message.dto';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import { ObjectDetectionResponse } from './response.type';

@Injectable()
export class ObjectDetectionService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    private cloudinary: CloudinaryService,
  ) {
    super(aiChatService);

    // const apiKey = '5e9e66ce-9fa3-442b-a4b0-74fde35a34c8';
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
    const attachUrl = attachFile
      ? await this.cloudinary
          .uploadFile(attachFile)
          .then((res) => res.secure_url)
      : payload.attach_url;

    payload.attach_url = attachUrl;

    const response = await fetch(attachUrl);
    const arrayBuffer = await response.arrayBuffer();
    const imageBase64 = Buffer.from(arrayBuffer).toString('base64');

    const fileType = mineType.lookup(attachUrl) as string;

    const allowFormat = ['image/jpeg', 'image/png', 'image/jpg', 'image/bmp'];
    if (!allowFormat.includes(fileType))
      throw new Error('File type is not supported');

    const responseText = await this.getAnswer(fileType, imageBase64);

    await this.aiChatService.saveMessage(payload);

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: JSON.stringify(responseText.data),
      role: user_role.BOT,
    });
  }
}
