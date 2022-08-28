import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Post } from '../entity/post.entity';

@InputType()
export class CheckPasswordInput {
  @Field((type) => String, { nullable: true })
  password?: string;

  @Field((type) => Number)
  postId: number;
}

@ObjectType()
export class CheckPasswordOutput {
  @Field((type) => Boolean)
  isSame: boolean;

  @Field((type) => Post, { nullable: true })
  post?: Post;
}
