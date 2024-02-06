import { ApiProperty } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { JOI_DEFAULT_VALIDATION_OPTIONS } from 'src/commons/validations';

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class SelectAIToolsDto {
  @ApiProperty({ type: Array })
  @JoiSchema(Joi.array().items(Joi.string().guid().required()).required())
  ai_tool_id: string[];

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().guid().max(256).required())
  work_progress_id?: string;
}
