import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

@InputType()
export class CheckAuthNumInput {
  @Field((type) => String)
  authNum: string;

  @Field((type) => String)
  phoneNumber: string;
}

@ObjectType()
export class CheckAuthNumOutput extends CoreOutput {}
