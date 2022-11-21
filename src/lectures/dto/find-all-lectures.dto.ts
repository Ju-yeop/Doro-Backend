import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dto/output.dto";
import { Overall_class_info } from "../entities/overall_class_info.entity";

@ObjectType()
export class FindAllLecturesOutput extends CoreOutput{
    @Field((type) => [Overall_class_info], { nullable: true })
    results?: Overall_class_info[];
}