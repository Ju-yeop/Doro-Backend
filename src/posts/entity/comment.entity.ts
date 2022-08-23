import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { Core } from 'src/common/entity/core.entity';
import { Post } from 'src/posts/entity/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('CreateCommentInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Comment extends Core {
  @Column()
  @Field((type) => String)
  @IsString()
  content: string;

  @ManyToOne((type) => Post, (post) => post.comments)
  post: Post;

  @ManyToOne((type) => User, (user) => user.comments, { eager: true })
  @Field((type) => User, { nullable: true })
  owner?: User;
}
