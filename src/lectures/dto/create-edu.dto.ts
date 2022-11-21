import {
  Field,
  InputType,
  IntersectionType,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Client } from '../entities/client.entity';
import { Detail_class_info } from '../entities/detail_class_info.entity';
import { Overall_class_info } from '../entities/overall_class_info.entity'

@InputType()
export class Detail_class_item extends OmitType(Detail_class_info, [
  'Overall_class_info','id', 'createdAt', 'updatedAt']) { }


@InputType()
export class CreateEduInput extends IntersectionType(
  PickType(Client, [
    'name',
    'institution_name',
    'position',
    'phone_number',
    'email',
  ] as const),
  OmitType(Overall_class_info, [
    'id',
    'createdAt',
    'updatedAt',
    'Detail_class_infos',
    'client'
  ] as const),
  ) {
  @Field((type) => [Detail_class_item])
  detail_classes: Detail_class_item[];
}

@ObjectType()
export class CreateEduOutput extends CoreOutput {}
