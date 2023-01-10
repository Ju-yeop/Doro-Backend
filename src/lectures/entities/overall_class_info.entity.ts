import {
  Field,
  InputType,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsInt, isInt, IsNumber, IsString } from 'class-validator';
import { Core } from 'src/common/entity/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { Detail_class_info } from './detail_class_info.entity';

@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Overall_class_info extends Core {
  @Column()
  @Field((type) => Int)
  @IsNumber()
  student_count: number;

  @Column()
  @Field((type) => String)
  @IsString()
  school_rank: string;

  @Column()
  @Field((type) => Int)
  @IsInt()
  budget: number;

  @Column()
  @Field((type) => String, { nullable: true, defaultValue: null })
  overall_remark?: string;

  @ManyToOne((type) => Client, (client) => client.Overall_class_infos, {
    eager: true,
  })
  @Field((type) => Client)
  client: Client;

  @OneToMany(
    (type) => Detail_class_info,
    (detail_class_info) => detail_class_info.Overall_class_info
  )
  @Field((type) => [Detail_class_info])
  Detail_class_infos?: Detail_class_info[];
}
