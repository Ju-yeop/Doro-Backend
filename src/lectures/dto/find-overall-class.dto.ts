import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Overall_class_info } from '../entities/overall_class_info.entity';

@InputType()
export class FindOverallClassInput {
  @Field((type) => Number)
  overall_Class_Id: number;
}

@ObjectType()
export class FindOverallClassOutput extends CoreOutput {
  @Field((type) => Overall_class_info, { nullable: true })
  overallClass?: Overall_class_info;
}
