import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { JOI_DEFAULT_VALIDATION_OPTIONS } from 'src/commons/validations';

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class CreateMessageDto {
  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().max(256).optional())
  @ApiPropertyOptional({ type: String, required: false })
  text?: string;

  @JoiSchema(Joi.boolean().optional())
  @ApiPropertyOptional({ type: String, required: false })
  is_respond?: boolean;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().optional())
  attach_url?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'binary',
    required: true,
  })
  attach_file?: Express.Multer.File;
}
