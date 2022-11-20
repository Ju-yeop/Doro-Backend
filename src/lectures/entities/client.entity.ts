import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';
import { Core } from 'src/common/entity/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Overall_class_info } from './overall_class_info.entity';

@InputType({isAbstract:true})
@Entity()
@ObjectType()
export class Client extends Core {
  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Column()
  @Field((type) => String)
  @IsString()
  institution_name: string;

  @Column()
  @Field((type) => String)
  @IsString()
  position: string;

  @Column()
  @Field((type) => String)
  @IsString()
  phone_number: string;

  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  @OneToMany(
    (type) => Overall_class_info,
    (Overall_class_info) => Overall_class_info.client,
    { nullable: true },
  )
  @Field((type) => [Overall_class_info])
  Overall_class_infos?: Overall_class_info[];
}
