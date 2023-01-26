import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Overall_class_info } from '../entities/overall_class_info.entity';

@ObjectType()
export class Overall_Classes_Output_Item extends OmitType(
  Overall_class_info,
  ['Detail_class_infos'],
  ObjectType
) {}

@InputType()
export class FindOverallClassesInput {
  @Field((type) => String)
  phone_number: string;

  @Field((type) => String)
  name: string;
}

@ObjectType()
export class FindOverallClassesOutput extends CoreOutput {
  @Field((type) => [Overall_Classes_Output_Item], { nullable: true })
  overallClasses?: Overall_Classes_Output_Item[];
}
