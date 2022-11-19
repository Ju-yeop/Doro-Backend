import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Detail_class_info } from './entities/detail_class_info.entity';
import { Overall_class_info } from './entities/overall_class_info.entity';

@Injectable()
export class LectureService {
    constructor(
        @InjectRepository(Client)
        private client: Repository<Client>,
        @InjectRepository(Detail_class_info)
        private detail_class_info: Repository<Detail_class_info>,
        @InjectRepository(Overall_class_info)
        private overall_class_info: Repository<Overall_class_info>
    ){}
}
