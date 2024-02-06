import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { JOI_DEFAULT_VALIDATION_OPTIONS } from '@/commons/validations';

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class CreateMessagePapagoTranslationDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().guid().required())
  room_id: string;

  @ApiPropertyOptional({ type: String })
  attach_url: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().required())
  source_code: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().required())
  target_code: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.optional())
  config?: string;
}

export type DocTransUpload = {
  data: {
    requestId: string;
  };
};

export type DocTransUploadStatus = {
  data: {
    data: {
      status: string;
    };
  };
};
