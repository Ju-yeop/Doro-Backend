import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsInt, isInt, IsNumber } from 'class-validator';
import { Core } from 'src/common/entity/core.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { Detail_class_info } from './detail_class_info.entity';

export enum SchoolRank {
  Elementary = 'Elementary',
  Middle = 'Middle',
  High = 'High',
}

registerEnumType(SchoolRank, { name: 'SchoolRank' });

@InputType({isAbstract:true})
@Entity()
@ObjectType()
export class Overall_class_info extends Core {
  @Column()
  @Field((type) => Int)
  @IsNumber()
  student_count: number;

  @Column({ type: 'enum', enum: SchoolRank })
  @Field((type) => SchoolRank)
  @IsEnum(SchoolRank)
  school_rank: SchoolRank;

  @Column()
  @Field((type) => Int)
  @IsInt()
  grade: number;

  @Column()
  @Field((type) => Int)
  @IsInt()
  budget: number;

  @Column()
  @Field((type) => String)
  overall_remark: string;

  @ManyToOne((type) => Client, (client) => client.Overall_class_infos)
  @Field((type) => Client)
  client: Client;

  @OneToMany(
    (type) => Detail_class_info,
    (detail_class_info) => detail_class_info.Overall_class_info,
  )
  @Field((type) => [Detail_class_info])
  Detail_class_infos?: Detail_class_info[];
}
