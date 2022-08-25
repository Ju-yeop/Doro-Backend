import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Post } from '../entity/post.entity';

@InputType()
export class CreatePostInput extends PickType(Post, [
  'content',
  'title',
  'ownerName',
  'phoneNumber',
  'password',
  'email',
  'institution',
  'createdAt'
]) {}

@ObjectType()
export class CreatePostOutut extends CoreOutput {}
