import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class editUserInput extends PartialType(
  PickType(User, ['email', 'password', 'name']),
) {}

@ObjectType()
export class editUserOutput extends CoreOutput {}
