import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { JOI_DEFAULT_VALIDATION_OPTIONS } from '@/commons/validations';

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class AIToolListBySessionParamDto {
  @ApiProperty({ type: String, description: 'Session ID' })
  @JoiSchema(Joi.string().guid().required())
  session_id: string;
}
