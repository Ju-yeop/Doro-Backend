import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { Structor } from "../entity/structors.entity";

@InputType()
export class AddStructorInput extends PickType(Structor, [
    'date',
    'round',
    'available_structor',
]) { }

@ObjectType()
export class AddStructorOutput extends CoreOutput{}
