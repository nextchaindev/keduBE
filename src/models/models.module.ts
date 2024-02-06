import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AIToolModel } from './ai_tool.model';
import { AITool } from './entities/ai_tool.entity';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { User } from './entities/user.entity';
import { MessageModel } from './message.model';
import { RoomModel } from './room.model';
import { UserModel } from './user.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, AITool, Room, Message])],
  providers: [UserModel, AIToolModel, RoomModel, MessageModel],
  exports: [UserModel, AIToolModel, RoomModel, MessageModel],
})
export class ModelsModule {}
