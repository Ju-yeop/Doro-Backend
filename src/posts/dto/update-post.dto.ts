import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Post } from '../entity/post.entity';
import { CreatePostInput } from './create-post.dto';

@InputType()
export class UpdatePostInput extends PickType(Post, [
  'content',
  'title',
  'ownerName',
  'phoneNumber',
  'password',
  'isLocked',
  'id',
]) {
  @Field((type) => String, { nullable: true })
  email?: string;
  @Field((type) => String, { nullable: true })
  institution?: string;
}
@ObjectType()
export class UpdatePostOutput extends CoreOutput {}
