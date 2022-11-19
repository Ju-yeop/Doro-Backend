import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { Structor } from "../entity/structors.entity";

@ObjectType()
export class FindAllRoundsOutput extends CoreOutput {
  @Field((type) => [Structor], { nullable: true })
  rounds?: Structor[];
}