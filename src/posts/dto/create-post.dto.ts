import {
  Field,
  InputType,
  Int,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Column } from 'typeorm';
import { Post } from '../entity/post.entity';

@InputType()
export class CreatePostInput extends PickType(Post, [
  'content',
  'ownerId',
  'title',
]) {
  @Field((type) => String, { nullable: true })
  password?: string;
}

@ObjectType()
export class CreatePostOutut extends CoreOutput {}
