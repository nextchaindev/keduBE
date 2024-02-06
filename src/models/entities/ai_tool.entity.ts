import { CommonEntity } from 'src/commons/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'ai_tool', schema: process.env.POSTGRES_SCHEMA })
export class AITool extends CommonEntity {
  @Column({
    name: 'key',
    type: 'varchar',
    nullable: true,
  })
  key?: string;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'en_name',
    type: 'varchar',
    nullable: true,
  })
  enName: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
  })
  description?: string;

  @Column({
    name: 'logo',
    type: 'varchar',
    nullable: true,
  })
  logo?: string;

  @Column({
    name: 'api_key',
    type: 'varchar',
    nullable: true,
    select: false,
  })
  apiKey?: string;

  @Column({
    name: 'api_key_id',
    type: 'varchar',
    nullable: true,
    select: false,
  })
  apiKeyId?: string;

  @Column({
    name: 'organization_key',
    type: 'varchar',
    nullable: true,
    select: false,
  })
  organizationKey?: string;

  @Column({
    name: 'is_published',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isPublished?: boolean;

  @Column({
    name: 'video_path',
    type: 'varchar',
    nullable: true,
  })
  videoPath?: string;

  @OneToMany(() => AITool, (e) => e.parent)
  children?: AITool[];

  @ManyToOne(() => AITool, (e) => e.children)
  @JoinColumn({ name: 'ai_parent_id', referencedColumnName: 'id' })
  parent?: AITool;
}
