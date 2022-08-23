import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeletePostInput {
  @Field((type) => Number)
  postId: number;

  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class DeletePostOutput extends CoreOutput {}
