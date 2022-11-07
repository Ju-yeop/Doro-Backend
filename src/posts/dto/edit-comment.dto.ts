import {
    Field,
  InputType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Comment } from '../entity/comment.entity';

@InputType()
export class EditCommentInput extends PickType(Comment, [
  'content'
]) {
    @Field((type) => Number)
    postId: number;
}

@ObjectType()
export class EditCommentOutput extends CoreOutput {}
