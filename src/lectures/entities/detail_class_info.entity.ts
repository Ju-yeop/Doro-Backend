import { Field, Int, ObjectType } from '@nestjs/graphql';
import { boolean } from 'joi';
import { Core } from 'src/common/entity/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Overall_class_info } from './overall_class_info.entity';

@Entity()
@ObjectType()
export class Detail_class_info extends Core {
  @Column()
  @Field((type) => String)
  class_name: string;

  @Column()
  @Field((type) => Int)
  student_number: number;

  @Column()
  @Field((type) => String)
  date: String;

  @Column()
  @Field((type) => String)
  remark: String;

  @Column()
  @Field((type) => boolean)
  unfixed: Boolean;

  @ManyToOne(
    (type) => Overall_class_info,
    (overall_class_info) => overall_class_info.Detail_class_infos,
    {
      onDelete: 'CASCADE',
    },
  )
  @Field((type) => Overall_class_info)
  Overall_class_info: Overall_class_info;
}
