import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Detail_class_info } from './entities/detail_class_info.entity';
import { Overall_class_info } from './entities/overall_class_info.entity';
import { LectureResolver } from './lectures.resolver';
import { LectureService } from './lectures.service';

@Module({
  imports:[TypeOrmModule.forFeature([Client, Detail_class_info, Overall_class_info])],
  providers: [LectureService, LectureResolver],
  exports: [LectureService]
})
export class LectureMdoule {}
