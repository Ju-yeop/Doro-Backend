import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

export enum sendOption {
  auth = 'auth',
  mypage = 'mypage',
}

@InputType()
export class SendAuthNumInput {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  phoneNumber: string;

  @Field((type) => sendOption)
  sendOption: sendOption;
}

@ObjectType()
export class SendAuthNumOutput extends CoreOutput {}
