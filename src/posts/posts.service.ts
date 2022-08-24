import { Injectable } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
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
import { UpdatePostInput, UpdatePostOutput } from './dto/update-post.dto';
import { Comment } from './entity/comment.entity';
import { Post } from './entity/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private posts: Repository<Post>, // @InjectRepository(Comment) // private Comment: Repository<Post>,

    @InjectRepository(Comment)
    private comment: Repository<Comment>,
  ) {}
  async createPost(
    user: User,
    CreatePostInput: CreatePostInput,
  ): Promise<CreatePostOutut> {
    try {
      const newPost = this.posts.create({
        ownerId: user.id,
        ...CreatePostInput,
      });
      await this.posts.save(newPost);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'could not make post',
      };
    }
  }
  async findPost(FindPostInput: FindPostInput): Promise<FindPostOutput> {
    try {
      //password 입력이 없을때 즉 frontend에서 비밀글이 아니라고 판단했을때
      if (FindPostInput.password === null) {
        const post = await this.posts.findOne({
          where: {
            id: FindPostInput.postId,
          },
        }); //혹시 모르니까 해당글이 비밀글이 맞는지 아닌지를 backend측에서 한번더 검사한다.
        if (post.password === null) {
          return { ok: true, post };
        } else {
          return {
            ok: false,
            error: 'this post id locked you should input password',
          };
        }
      } else {
        //password 가 있을 경우  frontend에서 비밀글이라 판단했을때
        const post = await this.posts.findOne({
          where: {
            id: FindPostInput.postId,
          },
        });
        //만약 front에서 오류 났을때 비밀글이 아닌 글이 비밀글 처럼 보이게 된다면
        if (post.password === null) {
          return {
            ok: true,
            post,
          };
        }
        //입력받은 비밀번호 일치 여부에 따라 return
        if (FindPostInput.password === post.password) {
          return { ok: true, post };
        } else {
          return { ok: false, error: 'password is wrong' };
        }
      }
    } catch {
      return { ok: false, error: 'sorry we could not find post' };
    }
  }
  async findAllPosts({ page }: FindAllPostsInput): Promise<FindAllPostsOutput> {
    try {
      const [posts, totalResults] = await this.posts.findAndCount({
        skip: (page - 1) * 5,
        take: 5,
      });
      return {
        ok: true,
        results: posts,
        totalPages: Math.ceil(totalResults / 5),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: 'could not load posts',
      };
    }
  }
  async updatePost(
    user: User,
    UpdatePostInput: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    try {
      const post = await this.posts.findOne({
        where: {
          id: UpdatePostInput.id,
        },
      });
      //게시물이 존재하지 않음
      if (!post) {
        return {
          ok: false,
          error: 'could not find post',
        };
      }

      //익명 게시물임
      if (post.ownerId === null) {
        return {
          ok: false,
          error: 'no owner post, can not edit',
        };
      }

      //게시물은 있으나 owner가 아님
      if (post.ownerId && post.ownerId !== user.id) {
        return {
          ok: false,
          error: 'you are not owner, can not edit',
        };
      }

      //게시물도 있고 주인임
      if (post.ownerId && post.ownerId === user.id) {
        await this.posts.update(
          { id: UpdatePostInput.id },
          { ownerId: user.id, ...UpdatePostInput },
        );
        return {
          ok: true,
        };
      }
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
  async deletePost(
    user: User,
    DeletePostInput: DeletePostInput,
  ): Promise<DeletePostOutput> {
    try {
      const post = await this.posts.findOne({
        where: {
          id: DeletePostInput.postId,
        },
      });
      //게시물이 존재하지 않음
      if (!post) {
        return {
          ok: false,
          error: 'post does not exist try again',
        };
      }
      //post주인이 아님
      if (post.ownerId !== user.id) {
        return {
          ok: false,
          error: 'you are not owner cannot delete',
        };
      }
      await this.posts.delete(DeletePostInput.postId);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
  async createComment(
    user: User,
    CreateCommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    try {
      const post = await this.posts.findOne({
        where: { id: CreateCommentInput.postId },
      });
      if (!post) {
        return { ok: false, error: 'there is no post ' };
      }
      const newComment = this.comment.create({
        owner: user,
        ...CreateCommentInput,
        post,
      });
      await this.comment.save(newComment);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
  async findAllComments(
    FindAllCommentsInput: FindAllCommentsInput,
  ): Promise<FindAllCommentsOutput> {
    try {
      const comments = await this.comment.find({
        where: {
          post: { id: FindAllCommentsInput.postId },
        },
      });

      return {
        ok: true,
        comments,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
  async deleteComment(
    user: User,
    DeleteCommentInput: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    try {
      const targetComment = await this.comment.findOne({
        where: {
          id: DeleteCommentInput.commentId,
        },
      });
      if (!targetComment) {
        return {
          ok: false,
          error: 'there is no comment',
        };
      }
      console.log(targetComment);
      if (!targetComment.owner) {
        return {
          ok: false,
          error: 'there is no owner',
        };
      }
      if (targetComment.owner.id !== user.id) {
        return {
          ok: false,
          error: 'you are not owner',
        };
      }
      await this.comment.delete(DeleteCommentInput.commentId);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: true,
        error: e,
      };
    }
  }
}
