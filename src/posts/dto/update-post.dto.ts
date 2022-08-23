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
export class UpdatePostInput extends PartialType(
  PickType(Post, ['title', 'content', 'password', 'id']),
) {}
@ObjectType()
export class UpdatePostOutput extends CoreOutput {}
