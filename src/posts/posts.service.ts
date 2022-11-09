import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository, Not } from 'typeorm';
import {
  CheckPasswordInput,
  CheckPasswordOutput,
} from './dto/check-password.dto';
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
import { SolapiMessageService } from 'solapi';
import * as bcrypt from 'bcrypt';
import { EditCommentInput, EditCommentOutput } from './dto/edit-comment.dto';


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
    { password, ...CreatePostInput }: CreatePostInput,
  ): Promise<CreatePostOutut> {
    try {
      //로그인 회원
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);

      const messageService = new SolapiMessageService(
        process.env.SOLAPIKEY,
        process.env.SOLAPISECRETKEY
      );

      if (user) {
        const newPost = this.posts.create({
          ownerId: user.id,
          password: hash,
          ...CreatePostInput,
        });
        await this.posts.save(newPost);

        messageService
        .sendOne({
          to: '01076330371',
          from: process.env.PHONE_NUMBER,
          kakaoOptions: {
            pfId: process.env.KAKAOPFID,
            templateId: 'KA01TP221013112749783YFgBRxkPdcG',
            disableSms: false,
            adFlag: false,
            variables: {
              '#{성함}': newPost.ownerName,
              '#{제목}': newPost.title,
              '#{소속기관}': newPost.institution,
              '#{작성일}': newPost.createdAt.toISOString().slice(0, 10),
              '#{url}':
                newPost.isLocked == false
                  ? `doroedu.net/post/${newPost.id}`
                  : `doroedu.net/post/${newPost.id}?hp=${newPost.password}`,
            },
          },
          autoTypeDetect: true,
        })
        .then((res) => console.log(res));

        return {
          ok: true,
        };
      }
      //비로그인 회원
      {
        const newPost = this.posts.create({
          password: hash,
          ...CreatePostInput,
        });
        await this.posts.save(newPost);

        messageService
        .sendOne({
          to: '01076330371',
          from: process.env.PHONE_NUMBER,
          kakaoOptions: {
            pfId: process.env.KAKAOPFID,
            templateId: 'KA01TP221013112749783YFgBRxkPdcG',
            disableSms: false,
            adFlag: false,
            variables: {
              '#{성함}': newPost.ownerName,
              '#{소속기관}': newPost.institution,
              '#{연락처}': newPost.phoneNumber,
              '#{글 제목}': newPost.title,
              '#{글 내용}': newPost.content,
              '#{url}':
                newPost.isLocked == false
                  ? `doroedu.net/post/${newPost.id}`
                  : `doroedu.net/post/${newPost.id}?hp=${newPost.password}`,
            },
          },
          autoTypeDetect: true,
        })
          .then((res) => console.log(res));
        
        return {
          ok: true,
        };
      }
    } catch (e) {
      return {
        ok: false,
        error: 'could not make post',
      };
    }
  }

  async checkPassword(
    user: User,
    CheckPasswordInput: CheckPasswordInput,
  ): Promise<CheckPasswordOutput> {
    try {
      const post = await this.posts.findOne({
        where: {
          id: CheckPasswordInput.postId,
        },
      });
      if (user && user.role === 'Manager') {
        return { isSame: true, post };
      }
      if (bcrypt.compareSync(CheckPasswordInput.password, post.password)) {
        return { isSame: true, post };
      } else {
        return { isSame: false };
      }
    } catch {
      return {
        isSame: false,
      };
    }
  }

  async findPost(
    user: User,
    FindPostInput: FindPostInput,
  ): Promise<FindPostOutput> {
    try {
      const post = await this.posts.findOne({
        where: {
          id: FindPostInput.postId,
        },
      });
      //게시물이 존재하지 않음
      if (!post) {
        return {
          ok: false,
          error: 'there is no post',
        };
      }
      return {
        ok: true,
        post,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }
  async findAllPosts({ page }: FindAllPostsInput): Promise<FindAllPostsOutput> {
    try {
      const noticeCount = await this.posts.count({
        where: { password: 'doro2020' },
      });
      const [notices, noticeResults] = await this.posts.findAndCount({
        order: {
          id: 'DESC',
        },
        where: { password: 'doro2020' },
      });
      const [posts, totalResults] = await this.posts.findAndCount({
        order: {
          id: 'DESC',
        },
        where: { password: Not('doro2020') },
        skip: (page - 1) * (11 - noticeCount),
        take: 11 - noticeCount,
      });
      const Array = [...posts];
      const newArray = notices.concat(Array);
      const countResult = totalResults + noticeResults;

      return {
        ok: true,
        results: newArray,
        totalPages: Math.ceil(totalResults / (11 - noticeCount)),
        totalResults: countResult,
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
      await this.posts.update(
        { id: UpdatePostInput.id },
        { ...UpdatePostInput },
      );
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
      await this.posts.delete({ id: post.id });
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
      /*Solapi Test-------------------------------- */

      const messageService = new SolapiMessageService(
        process.env.SOLAPIKEY,
        process.env.SOLAPISECRETKEY
      );

      messageService
        .sendOne({
          to: post.phoneNumber,
          from: process.env.PHONE_NUMBER,
          kakaoOptions: {
            pfId: process.env.KAKAOPFID,
            templateId: 'KA01TP221013114110860VPIY2uRThDq',
            disableSms: false,
            adFlag: false,
            variables: {
              '#{성함}': post.ownerName,
              '#{제목}': post.title,
              '#{소속기관}': post.institution,
              '#{작성일}': post.createdAt.toISOString().slice(0, 10),
              '#{url}':
                post.isLocked == false
                  ? `doroedu.net/post/${post.id}`
                  : `doroedu.net/post/${post.id}?hp=${post.password}`,
            },
          },
          autoTypeDetect: true,
        })
        .then((res) => console.log(res));
      /*-------------------------------- */
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
      if (!targetComment.owner) {
        return {
          ok: false,
          error: 'there is no owner',
        };
      }
      if (targetComment.owner.id !== user.id && user.role !== 'Manager') {
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

  async editComment(
    user: User,
    EditCommentInput: EditCommentInput,
  ): Promise<EditCommentOutput> {
    try {
      /* FrontEnd에서 CommentID를 받아올 수가 없어서 
      프론트에서 postID를 받고 백엔드에서 postId를 통해 해당 Post의 
      Comment들을 Find한 다음 그 중 가장 마지막 Comment의 Content를 수정한다.*/
      const comments = await this.comment.find({
        where: {
          post:{id: EditCommentInput.postId}
        }
      })
      if (!comments) {
        return {
          ok: false,
          error: 'could not find post',
        };
      }
      comments.sort(function(a, b){return a.id - b.id}) //정렬하지 않을 경우 UpdatedAt 기준 정렬
      const commentId = comments[comments.length-1].id; //JS에서는 [-1] 사용 불가능
      
      await this.comment.update(
        { id:commentId },
        { content: EditCommentInput.content },
      );
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
}
