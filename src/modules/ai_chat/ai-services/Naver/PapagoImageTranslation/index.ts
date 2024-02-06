import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { MessageModel } from '@/models/message.model';
import { RoomModel } from '@/models/room.model';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { CreateMessageAIChatDto } from '@/modules/ai_chat/dto/send-message.dto';
import { ChatService } from '@/modules/chat/chat.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import { PapagoImageToImage } from './response.type';

@Injectable()
export class PapagoImageTranslationService extends CommonAIServices {
  constructor(
    protected readonly messageModel: MessageModel,
    protected readonly roomModel: RoomModel,
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    private cloudinary: CloudinaryService,
  ) {
    super(aiChatService);

    this.serviceURL =
      'https://naveropenapi.apigw.ntruss.com/image-to-image/v1/translate';

    this.init('PapagoImageTranslation');
  }

  private async getAnswer(
    source_code: string,
    target_code: string,
    file: Express.Multer.File,
  ): Promise<PapagoImageToImage> {
    const formData = new FormData();
    formData.append('image', Buffer.from(file.buffer), file.originalname);
    formData.append('source', source_code);
    formData.append('target', target_code);

    const response = await axios.post(this.serviceURL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-NCP-APIGW-API-KEY-ID': this.apiKeyId,
        'X-NCP-APIGW-API-KEY': this.apiKey,
      },
    });

    return response.data;
  }

  async sendMessage(
    payload: CreateMessageAIChatDto,
    attachFile?: Express.Multer.File,
  ): Promise<any> {
    if (!attachFile) throw new Error('File is required');
    if (!payload.source_code || !payload.target_code)
      throw new Error('Language code is required');

    const attachUrl = await this.cloudinary
      .uploadImageFile(attachFile)
      .then((res) => res.secure_url);

    payload.attach_url = attachUrl;

    const responseText = (await this.getAnswer(
      payload.source_code,
      payload.target_code,
      attachFile,
    )) as PapagoImageToImage;

    const imageUrl = await this.cloudinary
      .uploadBase64ImageFile(
        'data:image/jpeg;base64,' + responseText.data.renderedImage,
      )
      .then((res) => res.secure_url);

    await this.aiChatService.saveMessage(payload);

    return await this.aiChatService.saveMessage({
      room_id: payload.room_id,
      text: responseText.data.targetText,
      attach_url: imageUrl,
    });
  }

  async getLanguageCode() {
    return [
      {
        code: 'ko',
        name: 'Korean',
        korean_name: '한국어',
      },
      {
        code: 'en',
        name: 'English',
        korean_name: '영어',
      },
      {
        code: 'ja',
        name: 'Japanese',
        korean_name: '일본어',
      },
      {
        code: 'zh-CN',
        name: 'Chinese (Simplified)',
        korean_name: '중국어 (간체)',
      },
      {
        code: 'zh-TW',
        name: 'Chinese (Traditional)',
        korean_name: '중국어 (번체)',
      },
      {
        code: 'vi',
        name: 'Vietnamese',
        korean_name: '베트남어',
      },
      {
        code: 'th',
        name: 'Thai',
        korean_name: '태국어',
      },
      {
        code: 'id',
        name: 'Indonesian',
        korean_name: '인도네시아어',
      },
      {
        code: 'fr',
        name: 'French',
        korean_name: '프랑스어',
      },
      {
        code: 'es',
        name: 'Spanish',
        korean_name: '스페인어',
      },
      {
        code: 'ru',
        name: 'Russian',
        korean_name: '러시아어',
      },
      {
        code: 'de',
        name: 'German',
        korean_name: '독일어',
      },
      {
        code: 'it',
        name: 'Italian',
        korean_name: '이탈리아어',
      },
    ];
  }
}
