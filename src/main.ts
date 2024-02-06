import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';
import { CustomReturnFieldsInterceptor } from './middlewares/custom-return-fields.interceptor';
import { HttpExceptionFilter } from './middlewares/https-exception.filter';

const logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const API_PORT = configService.get<string>('API_PORT') ?? 4000;

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(helmet());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(new CustomReturnFieldsInterceptor());

  await app.listen(API_PORT);

  logger.log(`✅Application running on port ${API_PORT}✅`);
}

bootstrap();
