import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { CreatePostInput } from './create-post.dto';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {
  @Field((type) => Number, { nullable: true })
  owenrId?: number;
}
@ObjectType()
export class UpdatePostOutput extends CoreOutput {}
