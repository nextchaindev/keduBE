import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { user_role } from 'src/commons/role';
import { JOI_DEFAULT_VALIDATION_OPTIONS } from 'src/commons/validations';

const language_code_naver = [
  'ko',
  'en',
  'ja',
  'zh-CN',
  'zh-TW',
  'vi',
  'id',
  'th',
  'fr',
  'es',
  'ru',
  'de',
  'it',
];

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class CreateMessageAIChatDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().guid().required())
  room_id: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().max(1000).optional())
  text?: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().optional())
  language_code?: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(
    Joi.string()
      .optional()
      .valid(...language_code_naver),
  )
  source_code?: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(
    Joi.string()
      .optional()
      .valid(...language_code_naver),
  )
  target_code?: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().optional())
  attach_url?: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().max(256).optional())
  sentence1?: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().max(256).optional())
  sentence2?: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().valid(user_role))
  role?: user_role;
}
