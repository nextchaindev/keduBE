import { CommonEntity } from 'src/commons/entities';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AITool } from './ai_tool.entity';
import { Message } from './message.entity';

@Entity({ name: 'room', schema: process.env.POSTGRES_SCHEMA })
export class Room extends CommonEntity {
  @Column({ name: 'title', type: 'varchar', nullable: false })
  title?: string;

  @OneToMany(() => Message, (e) => e.room, {
    cascade: true,
  })
  messages: Message[];

  @Column({ name: 'document_id', type: 'varchar', nullable: true })
  documentId?: string;

  @Column({ name: 'document_url', type: 'varchar', nullable: true })
  documentUrl?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive?: boolean;

  @ManyToOne(() => AITool, (e) => e.rooms, {
    nullable: false,
  })
  aiTool: AITool;
}
