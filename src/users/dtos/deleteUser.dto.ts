import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class deleteUserInput {
  @Field((type) => Number)
  UserId: number;
}

@ObjectType()
export class deleteUserOutput extends CoreOutput {}
