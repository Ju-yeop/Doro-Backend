import { Field, InputType, ObjectType, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Client } from '../entities/client.entity';
import { Overall_class_info } from '../entities/overall_class_info.entity';
import { Detail_class_item } from './create-edu.dto';

@InputType()
export class UpdateOverallClassItem extends OmitType(Overall_class_info, [
    'id',
    'createdAt',
    'updatedAt',
    'Detail_class_infos',  //Check
    'client']){}

@InputType()
export class UpdateEduInput{
    @Field((type) => [Detail_class_item])
    detail_classes: Detail_class_item[];

    @Field((type) => UpdateOverallClassItem)
    overall_class: UpdateOverallClassItem;

    @Field(() => Number)
    overallId: number;
}

@ObjectType()
export class UpdateEduOutput extends CoreOutput {}
