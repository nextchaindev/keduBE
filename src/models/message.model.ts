import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModel } from 'src/commons/common.model';
import { Repository } from 'typeorm';

import { Message } from './entities/message.entity';

@Injectable()
export class MessageModel extends CommonModel {
  constructor(
    @InjectRepository(Message)
    public repository: Repository<Message>,
  ) {
    super();
  }
}
