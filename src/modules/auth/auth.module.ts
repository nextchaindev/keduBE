import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ModelsModule } from 'src/models/models.module';

import { EncryptionsModule } from '../encryptions/encryptions.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt-auth.strategy';

@Module({
  imports: [
    ModelsModule,
    EncryptionsModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
