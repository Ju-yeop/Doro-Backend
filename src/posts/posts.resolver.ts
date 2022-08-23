import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import { CreatePostInput, CreatePostOutut } from './dto/create-post.dto';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dto/delete-comment.dto';
import { DeletePostInput, DeletePostOutput } from './dto/delete-user.dto';
import {
  FindAllCommentsInput,
  FindAllCommentsOutput,
} from './dto/find-all-comments.dto';
import {
  FindAllPostsInput,
  FindAllPostsOutput,
} from './dto/find-all-posts.dto';
import { FindPostInput, FindPostOutput } from './dto/find-post.dto';
import { UpdatePostOutput, UpdatePostInput } from './dto/update-post.dto';
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
  @Query(() => FindAllPostsOutput)
  async findAllPosts(
    @Args('input') FindAllPostsInput: FindAllPostsInput,
  ): Promise<FindAllPostsOutput> {
    return await this.postService.findAllPosts(FindAllPostsInput);
  }

  @Query(() => FindPostOutput)
  async findPost(
    @Args(`input`) FindPostInput: FindPostInput,
  ): Promise<FindPostOutput> {
    return await this.postService.findPost(FindPostInput);
  }
  @Mutation(() => UpdatePostOutput)
  async updatePost(
    @Args('input') UpdatePostInput: UpdatePostInput,
    @Args('PostId') PostId: number,
  ): Promise<UpdatePostOutput> {
    return await this.postService.updatePost(UpdatePostInput, PostId);
  }

  @Mutation(() => DeletePostOutput)
  async deletePost(
    @Args('input') DeletePostInput: DeletePostInput,
  ): Promise<DeletePostOutput> {
    return await this.postService.deletePost(DeletePostInput);
  }

  @Mutation(() => CreateCommentOutput)
  async createComment(
    @Args('input') CreateCommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    return await this.postService.createComment(CreateCommentInput);
  }

  @Query(() => FindAllCommentsOutput)
  async findAllComments(
    @Args('input') FindAllCommentsInput: FindAllCommentsInput,
  ): Promise<FindAllCommentsOutput> {
    return await this.postService.findAllComments(FindAllCommentsInput);
  }

  @Mutation(() => DeleteCommentOutput)
  async deleteComment(
    @Args('input') DeleteCommentInput: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    return await this.postService.deleteComment(DeleteCommentInput);
  }
}
