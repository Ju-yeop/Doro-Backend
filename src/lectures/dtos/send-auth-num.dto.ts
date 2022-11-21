import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';

export enum sendOption {
  auth = 'auth',
  mypage = 'mypage',
}
registerEnumType(sendOption, { name: 'sendOption' });
@InputType()
export class SendAuthNumInput {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  phoneNumber: string;

  @Field((type) => sendOption)
  Option: sendOption;
}

@ObjectType()
export class SendAuthNumOutput extends CoreOutput {}
