/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { Core } from 'src/common/entity/core.entity';
import { Post } from 'src/posts/entity/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole{
  Manager = 'Manager',
  Client = 'Client'
}

registerEnumType(UserRole, {name:'UserRole'})

@InputType({isAbstract:true})
@ObjectType()
@Entity()
export class User extends Core{
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  password: string
  
  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole

  @Column()
  @Field((type) => String)
  @IsString()
  name: string;

  @Field((type) => [Post])
  posts: Post[];
  // ownerId랑 OneToMany? 
  //아니면 Owner를 Post Entity에 만들고 Owner랑 OneToMany?
}
