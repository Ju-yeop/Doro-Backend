import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateEduInput, CreateEduOutput } from './dto/create-edu.dto';
import { FindOverallClassesInput, FindOverallClassesOutput } from './dto/find-overall-classes.dto';
import { Client } from './entities/client.entity';
import { Detail_class_info } from './entities/detail_class_info.entity';
import { Overall_class_info } from './entities/overall_class_info.entity';
import { LectureService } from './lectures.service';

@Resolver((of) => [Client, Detail_class_info, Overall_class_info])
export class LectureResolver {
    constructor(private readonly lectureService: LectureService) { }
    
    @Mutation(() => CreateEduOutput)
    async CreateEdu(
        @Args('input') createEduInput: CreateEduInput
    ): Promise<CreateEduOutput>{
        return this.lectureService.createEdu(createEduInput);
    }

    @Query(() => FindOverallClassesOutput)
    async FindOverallClasses(
        @Args('input') findOverallClassesInput:FindOverallClassesInput
    ): Promise<FindOverallClassesOutput>{
        return this.lectureService.findOverAllClasses(findOverallClassesInput);
    }
}
