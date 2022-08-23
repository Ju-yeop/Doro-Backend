import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/posts/entity/comment.entity';
import { Post } from './entity/post.entity';
import { PostResolver } from './posts.resolver';
import { PostService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}
