import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Comment } from '../entity/comment.entity';

@InputType()
export class FindAllCommentsInput {
  @Field((type) => Number)
  postId: number;
}

@ObjectType()
export class FindAllCommentsOutput extends CoreOutput {
  @Field((type) => [Comment], { nullable: true })
  comments?: Comment[];
}
