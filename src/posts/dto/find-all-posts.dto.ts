import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dto/pagination.dto';
import { Post } from '../entity/post.entity';

@InputType()
export class FindAllPostsInput extends PaginationInput {}

@ObjectType()
export class FindAllPostsOutput extends PaginationOutput {
  @Field((type) => [Post], { nullable: true })
  results?: Post[];
}
