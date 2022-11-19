import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class DeleteStructorInput {
  @Field((type) => Number)
  structorId: number;
}

@ObjectType()
export class DeleteStructorOutput extends CoreOutput {}
