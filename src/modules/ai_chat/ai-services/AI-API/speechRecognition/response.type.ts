import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { JOI_DEFAULT_VALIDATION_OPTIONS } from '@/commons/validations';

export const languageCode = [
  {
    code: 'korean',
    name: 'Korean',
    korean_name: '한국어',
  },
  {
    code: 'english',
    name: 'English',
    korean_name: '영어',
  },
  {
    code: 'japanese',
    name: 'Japanese',
    korean_name: '일본어',
  },
  {
    code: 'chinese',
    name: 'Chinese',
    korean_name: '중국어',
  },
  {
    code: 'spanish',
    name: 'Spanish',
    korean_name: '스페인어',
  },
  {
    code: 'french',
    name: 'French',
    korean_name: '프랑스어',
  },
  {
    code: 'german',
    name: 'German',
    korean_name: '독일어',
  },
  {
    code: 'russia',
    name: 'Russia',
    korean_name: '러시아어',
  },
  {
    code: 'vietnam',
    name: 'Vietnam',
    korean_name: '베트남어',
  },
  {
    code: 'arabic',
    name: 'Arabic',
    korean_name: '아랍어',
  },
  {
    code: 'thailand',
    name: 'Thailand',
    korean_name: '태국어',
  },
  {
    code: 'portuguese',
    name: 'Portuguese',
    korean_name: '포르투갈어',
  },
];

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class CreateMessageSpeechRecognitionDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().guid().required())
  room_id: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(
    Joi.string()
      .required()
      .valid(...languageCode.map((item) => item.code)),
  )
  language_code: string;

  @ApiPropertyOptional({
    type: String,
    format: 'binary',
    required: true,
  })
  attachFile: Express.Multer.File;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().optional())
  attach_url?: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.optional())
  config?: string;
}
