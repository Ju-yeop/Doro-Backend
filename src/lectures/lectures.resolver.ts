import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateEduInput, CreateEduOutput } from './dto/create-edu.dto';
import { FindAllLecturesOutput } from './dto/find-all-lectures.dto';
import { FindOverallClassInput, FindOverallClassOutput } from './dto/find-overall-class.dto';
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
        return this.lectureService.findOverallClasses(findOverallClassesInput);
    }

    @Query(() => FindOverallClassOutput)
    async FindOverallClass(
        @Args('input') findOverallClassInput: FindOverallClassInput
    ): Promise<FindOverallClassOutput>{
        return this.lectureService.findOverallClass(findOverallClassInput);
    }

    @Query(() => FindAllLecturesOutput)
    @Role(['Manager'])
    async FindAllLectures(
    ): Promise<FindAllLecturesOutput>{
        return this.lectureService.findAllLectures();
    }
}
