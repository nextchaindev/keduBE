import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { JOI_DEFAULT_VALIDATION_OPTIONS } from 'src/commons/validations';

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class RoomAIChatDto {
  @ApiPropertyOptional({ type: String, description: 'Room ID' })
  @JoiSchema(Joi.string().guid().min(1).max(256).required())
  roomId: string;
}
