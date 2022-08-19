import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePostInput, CreatePostOutut } from './dto/create-post.dto';
import { FindPostInput, FindPostOutput } from './dto/find-post.dto';
import { Post } from './entity/post.entity';
import { PostService } from './posts.service';

@Resolver((of) => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}
  @Mutation(() => CreatePostOutut)
  async createPost(
    @Args('input') CreatePostInput: CreatePostInput,
  ): Promise<CreatePostOutut> {
    return await this.postService.createPost(CreatePostInput);
  }

  @Query(() => FindPostOutput)
  async findPost(
    @Args(`input`) FindPostInput: FindPostInput,
  ): Promise<FindPostOutput> {
    return await this.postService.findPost(FindPostInput);
  }

  // @Query()
  // async findAllPost() {}
}
