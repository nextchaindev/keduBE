import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonModel } from 'src/commons/common.model';
import { Repository } from 'typeorm';

import { Room } from './entities/room.entity';

@Injectable()
export class RoomModel extends CommonModel {
  constructor(
    @InjectRepository(Room)
    public repository: Repository<Room>,
  ) {
    super();
  }
}
