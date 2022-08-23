import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import { CreatePostInput, CreatePostOutut } from './dto/create-post.dto';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dto/delete-comment.dto';
import { DeletePostInput, DeletePostOutput } from './dto/delete-post.dto';
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
  @Role(['Any'])
  async createPost(
    @AuthUser() authUser: User,
    @Args('input') CreatePostInput: CreatePostInput,
  ): Promise<CreatePostOutut> {
    return await this.postService.createPost(authUser, CreatePostInput);
  }
  @Query(() => FindAllPostsOutput)
  @Role(['Any'])
  async findAllPosts(
    @Args('input') FindAllPostsInput: FindAllPostsInput,
  ): Promise<FindAllPostsOutput> {
    return await this.postService.findAllPosts(FindAllPostsInput);
  }

  @Query(() => FindPostOutput)
  @Role(['Any'])
  async findPost(
    @Args(`input`) FindPostInput: FindPostInput,
  ): Promise<FindPostOutput> {
    return await this.postService.findPost(FindPostInput);
  }
  @Mutation(() => UpdatePostOutput)
  @Role(['Client'])
  async updatePost(
    @AuthUser() authUser: User,
    @Args('input') UpdatePostInput: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    return await this.postService.updatePost(authUser, UpdatePostInput);
  }

  @Mutation(() => DeletePostOutput)
  @Role(['Client'])
  async deletePost(
    @AuthUser() authUser: User,
    @Args('input') DeletePostInput: DeletePostInput,
  ): Promise<DeletePostOutput> {
    return await this.postService.deletePost(authUser, DeletePostInput);
  }

  @Mutation(() => CreateCommentOutput)
  async createComment(
    @AuthUser() authUser: User,
    @Args('input') CreateCommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    return await this.postService.createComment(authUser, CreateCommentInput);
  }

  @Query(() => FindAllCommentsOutput)
  async findAllComments(
    @Args('input') FindAllCommentsInput: FindAllCommentsInput,
  ): Promise<FindAllCommentsOutput> {
    return await this.postService.findAllComments(FindAllCommentsInput);
  }

  @Mutation(() => DeleteCommentOutput)
  @Role(['Client'])
  async deleteComment(
    @AuthUser() authUser: User,
    @Args('input') DeleteCommentInput: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    return await this.postService.deleteComment(authUser, DeleteCommentInput);
  }
}
