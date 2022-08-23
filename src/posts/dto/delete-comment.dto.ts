import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeleteCommentInput {
  @Field((type) => Number)
  commentId: number;
}

@ObjectType()
export class DeleteCommentOutput extends CoreOutput {}
