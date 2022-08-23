import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Post } from '../entity/post.entity';

@InputType()
export class CreatePostInput extends PickType(Post, ['content', 'title']) {
  @Field((type) => String, { nullable: true })
  password?: string;
}

@ObjectType()
export class CreatePostOutut extends CoreOutput {}
