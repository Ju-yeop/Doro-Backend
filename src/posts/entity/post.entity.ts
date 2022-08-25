import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString } from 'class-validator';
import { Comment } from 'src/posts/entity/comment.entity';
import { Core } from 'src/common/entity/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
@InputType('CreatePostInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Post extends Core {
  @Column()
  @Field((type) => String)
  @IsString()
  title: string;

  @Column()
  @Field((type) => String)
  @IsString()
  content: string;

  @Column({ default: null })
  @Field((type) => String, { nullable: true })
  @IsString()
  password?: string;

  @Column()
  @Field((type) => String)
  @IsString()
  ownerName: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  institution?: string;

  @Column()
  @Field((type) => String)
  @IsString()
  phoneNumber: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  email?: string;

  @Column({ default: null })
  @Field((type) => Number, { nullable: true })
  @IsInt()
  ownerId?: number;

  @OneToMany((type) => Comment, (comment) => comment.post, {
    eager: true,
    nullable: true,
  })
  @Field((type) => [Comment])
  comments: Comment[];
}
