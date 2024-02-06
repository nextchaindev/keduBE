import { CommonEntity } from 'src/commons/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Room } from './room.entity';

@Entity({ name: 'message', schema: process.env.POSTGRES_SCHEMA })
export class Message extends CommonEntity {
  @ManyToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @Column({ name: 'reply_id', type: 'uuid', nullable: true })
  replyId?: string;

  @Column({ name: 'text', type: 'varchar', nullable: true })
  text?: string;

  @Column({ name: 'attach_url', type: 'varchar', nullable: true })
  attachUrl?: string;

  @Column({ name: 'language_code', type: 'varchar', nullable: true })
  language_code?: string;

  @Column({ name: 'sentence1', type: 'varchar', nullable: true })
  sentence1?: string;

  @Column({ name: 'sentence2', type: 'varchar', nullable: true })
  sentence2?: string;

  @Column({ name: 'config', type: 'varchar', nullable: true })
  config?: string;
}
