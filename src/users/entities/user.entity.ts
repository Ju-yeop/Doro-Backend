/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { Core } from 'src/common/entity/core.entity';
import { Post } from 'src/posts/entity/post.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Comment } from 'src/posts/entity/comment.entity';

export enum UserRole {
  Manager = 'Manager',
  Client = 'Client',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends Core {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  password: string;

  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Column()
  @Field((type) => String)
  @IsString()
  institution: string;

  @Column()
  @Field((type) => String)
  @IsString()
  plcae: string;

  @Column({ nullable: true })
  @Field((type) => String, { nullable: true })
  @IsString()
  rank?: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Field((type) => [Post])
  posts: Post[];
  // ownerId랑 OneToMany?
  //아니면 Owner를 Post Entity에 만들고 Owner랑 OneToMany?

  @OneToMany((type) => Comment, (comment) => comment.owner)
  @Field((type) => [Comment])
  comments: Comment[];

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(passwordInput: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(passwordInput, this.password);
      return ok;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
