import { Module } from '@nestjs/common';
import { UserModel } from './user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AITool } from './entities/ai_tool.entity';
import { AIToolModel } from './ai_tool.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, AITool])],
  providers: [UserModel, AIToolModel],
  exports: [UserModel, AIToolModel],
})
export class ModelsModule {}
