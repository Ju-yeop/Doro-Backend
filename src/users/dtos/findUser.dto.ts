import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class findUserInput {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class findUserOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
