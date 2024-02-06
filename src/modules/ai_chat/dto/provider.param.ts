import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { JOI_DEFAULT_VALIDATION_OPTIONS } from '@/commons/validations';

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class IndexParamsDto {
  @JoiSchema(Joi.string().required())
  providerName: string;
}
