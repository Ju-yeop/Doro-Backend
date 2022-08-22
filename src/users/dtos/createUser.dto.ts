import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { User } from "../entities/user.entity";

@InputType()
export class CreateUserInput extends PickType(User, [
    'email',
    'password',
    'name',
    'role'
]) { }

@ObjectType()
export class CreateUserOutput extends CoreOutput {}