import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';

import { CommonAIServices } from '@/commons/ai-services/common-ai-services';
import { AiChatService } from '@/modules/ai_chat/ai_chat.service';
import { ChatService } from '@/modules/chat/chat.service';
import { CloudinaryService } from '@/modules/cloudinary/cloudinary.service';

import {
  CreateMessagePapagoTranslationDto,
  DocTransUploadStatus,
} from './response.type';

@Injectable()
export class PapagoTranslationService extends CommonAIServices {
  constructor(
    protected readonly chatService: ChatService,
    protected readonly aiChatService: AiChatService,
    private cloudinary: CloudinaryService,
  ) {
    super(aiChatService);

    this.serviceURL = 'https://naveropenapi.apigw.ntruss.com/doc-trans/v1';
    this.init('PapagoTranslation');
  }

  private async getAnswer(
    source_code: string,
    target_code: string,
    file: Express.Multer.File,
  ) {
    const formData = new FormData();
    formData.append('file', Buffer.from(file.buffer), file.originalname);
    formData.append('source', source_code);
    formData.append('target', target_code);

    const headers = {
      'X-NCP-APIGW-API-KEY-ID': this.apiKeyId,
      'X-NCP-APIGW-API-KEY': this.apiKey,
    };

    const response = await axios
      .post(this.serviceURL + '/translate', formData, { headers })
      .catch((err) => {
        throw new Error(err.response.data.displayMessage || err.response.data);
      });

    const requestId = response.data.data.requestId;

    const checkStatus = async () => {
      const result = (await axios
        .get(`${this.serviceURL}/status?requestId=${requestId}`, { headers })
        .catch((err) => {
          console.log(err.response.data);
        })) as DocTransUploadStatus;

      return result?.data?.data?.status === 'COMPLETE' || false;
    };

    while (!(await checkStatus())) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    const fileResult = await axios.get(
      `${this.serviceURL}/download?requestId=${requestId}`,
      { headers, responseType: 'arraybuffer' },
    );

    return fileResult.data;
  }

  async sendMessage(
    payload: CreateMessagePapagoTranslationDto,
    attachFile?: Express.Multer.File,
  ): Promise<any> {
    if (!attachFile) throw new Error('File is required');

    const allowFormat = ['.docx', '.pptx', '.xlsx', '.hwp'];
    if (!allowFormat.includes(path.extname(attachFile.originalname)))
      throw new Error('File type is not supported');

    const attachUrl = await this.cloudinary
      .uploadFile(attachFile)
      .then((res) => res.secure_url);

    payload.attach_url = attachUrl;

    const responseText = await this.getAnswer(
      payload.source_code,
      payload.target_code,
      attachFile,
    );

    const translateResult = await this.cloudinary
      .uploadBinaryFile(
        responseText,
        allowFormat[allowFormat.indexOf(path.extname(attachFile.originalname))],
      )
      .then((res) => res.secure_url);

    return {
      attach_url: translateResult,
    };
  }
}
