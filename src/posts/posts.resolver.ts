import { Args, Query, Resolver } from '@nestjs/graphql';
import { Post } from './entity/post.entity';

@Resolver((of) => Post)
export class PostResolver {
  @Query((returns) => [Post])
  users(@Args('input') nickname: boolean): Post[] {
    return [];
  }
}
