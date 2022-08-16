/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  @IsString()
  @Length(1, 5)
  name: string;

  @Field((type) => Boolean, { nullable: true })
  nickName?: boolean;
}
