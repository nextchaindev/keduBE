import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { JOI_DEFAULT_VALIDATION_OPTIONS } from '@/commons/validations';

import { speaker } from './speaker.data';

export interface PapagoImageToImage {
  data: Data;
}

export interface Data {
  sourceLang: string;
  targetLang: string;
  sourceText: string;
  targetText: string;
  blocks: Block[];
  renderedImage: string;
}

export interface Block {
  sourceLang: string;
  sourceText: string;
  targetText: string;
  lines: Line[];
  LB: LB;
  LT: LB;
  RB: LB;
  RT: LB;
}

export interface LB {
  x: number;
  y: number;
}

export interface Line {
  LB: LB;
  LT: LB;
  RB: LB;
  RT: LB;
  words?: Line[];
  sourceText?: string;
}

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class CreateMessageClovaDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().guid().required())
  room_id: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().required())
  text: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string()
      .required()
      .valid(...speaker.map((s) => s.speaker))
      .default('mijin'),
  )
  speaker: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string()
      .optional()
      .default('0')
      .valid(-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5),
  )
  speed: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string()
      .optional()
      .default('0')
      .valid(-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5),
  )
  alpha: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string()
      .optional()
      .default('0')
      .valid(-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5),
  )
  volume: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string()
      .optional()
      .default('0')
      .valid(-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5),
  )
  pitch: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(
    Joi.string()
      .optional()
      .default('0')
      .valid(-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5),
  )
  end_pitch: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional().default('0').valid(0, 1, 2, 3))
  emotion: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional().default('0').valid(0, 1, 2))
  emotion_strength: string;
}
