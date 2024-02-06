import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { JOI_DEFAULT_VALIDATION_OPTIONS } from '@/commons/validations';

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class ChatRoomParams {
  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().guid().required())
  roomId: string;
}

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class ChatMessageParams {
  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().guid().required())
  messageId: string;
}
