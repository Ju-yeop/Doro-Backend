import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class CheckPasswordInput {
  @Field((type) => String, { nullable: true })
  password?: string;

  @Field((type) => Number)
  postId: number;
}

@ObjectType()
export class CheckPasswordOutput {
  @Field((type) => Boolean)
  isSame: Boolean;
}
