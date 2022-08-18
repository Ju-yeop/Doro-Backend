import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput, CreatePostOutut } from './dto/create-post.dto';
import { Post } from './entity/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private posts: Repository<Post>, // @InjectRepository(Comment) // private Comment: Repository<Post>,
  ) {}
  async createPost(CreatePostInput: CreatePostInput): Promise<CreatePostOutut> {
    try {
      const newPost = this.posts.create(CreatePostInput);
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
}
