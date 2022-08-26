import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Post } from '../entity/post.entity';

@InputType()
export class CreatePostInput extends PickType(Post, [
  'content',
  'title',
  'ownerName',
  'phoneNumber',
  'isLocked',
]) {
  @Field((type) => String, { nullable: true })
  email?: string;
  @Field((type) => String, { nullable: true })
  institution?: string;
}

@ObjectType()
export class CreatePostOutut extends CoreOutput {}
