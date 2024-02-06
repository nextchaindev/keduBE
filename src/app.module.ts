import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { JoiPipeModule } from 'nestjs-joi';
import winston from 'winston';

import { AppConfig } from './app.config';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/role.guard';
import { ModelsModule } from './models/models.module';
import { AiChatModule } from './modules/ai_chat/ai_chat.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { EncryptionsModule } from './modules/encryptions/encryptions.module';
import { AiToolListModule } from './modules/ai-tool-list/ai-tool-list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
              prettyPrint: true,
            }),
          ),
        }),

        new winston.transports.File({
          filename: './logs/app_error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
              prettyPrint: true,
            }),
          ),
        }),

        new winston.transports.File({
          filename: './logs/app_combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    ThrottlerModule.forRoot({ ttl: 10, limit: 100 }),
    JoiPipeModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.NODE_ENV === 'development'
        ? {
            ssl: process.env.POSTGRES_SSL === 'true',
          }
        : {}),
      host: process.env.POSTGRES_DB_HOST,
      port: +process.env.POSTGRES_DB_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DB_NAME,
      schema: process.env.POSTGRES_SCHEMA,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      logging: true,
      migrations: ['dist/**/migrations/*{.ts,.js}'],
      migrationsTableName: 'kedu',
      migrationsRun: false,
      cache: process.env.NODE_ENV === 'production',
    }),

    ModelsModule,
    CloudinaryModule,
    AuthModule,
    EncryptionsModule,
    AiChatModule,
    ChatModule,
    AiToolListModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  controllers: [],
})
export class AppModule {}
