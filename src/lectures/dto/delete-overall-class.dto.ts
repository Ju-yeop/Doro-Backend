import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";

@InputType()
export class DeleteOverallClassInput {
  @Field((type) => Number)
  overallClassId: number
}

@ObjectType()
export class DeleteOverallClassOutput extends CoreOutput {
}
