import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Structor } from './entity/structors.entity';
import { StructorsResolver } from './structors.resolver';
import { StructorsService } from './structors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Structor])],
  providers: [StructorsResolver, StructorsService],
  exports: [StructorsService]
})
export class StructorsModule {}
