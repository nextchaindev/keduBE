import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AppConfig } from 'src/app.config';

import { ClientData } from '../decorators/get_current_user.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt']) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      AppConfig.PUBLIC_ENDPOINT_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest<T extends ClientData>(err: unknown, user: T) {
    if (user) return user;
    throw err || new UnauthorizedException();
  }
}
