import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Overall_class_info } from '../entities/overall_class_info.entity';

@InputType()
export class FindOverallClassesInput {
  @Field((type) => Number)
  clientId: number;
}

@ObjectType()
export class FindOverallClassesOutput extends CoreOutput {
  @Field((type) => [Overall_class_info], { nullable: true })
  overallClasses?: Overall_class_info[];
}
