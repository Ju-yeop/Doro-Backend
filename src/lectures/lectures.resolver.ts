import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CheckAuthNumInput,
  CheckAuthNumOutput,
} from './dtos/check-auth-num.dto';
import { SendAuthNumInput, SendAuthNumOutput } from './dtos/send-auth-num.dto';
import { Client } from './entities/client.entity';
import { Detail_class_info } from './entities/detail_class_info.entity';
import { Overall_class_info } from './entities/overall_class_info.entity';
import { LectureService } from './lectures.service';

@Resolver((of) => [Client, Detail_class_info, Overall_class_info])
export class LectureResolver {
  constructor(private readonly lectureService: LectureService) {}
  @Mutation(() => SendAuthNumOutput)
  async SendAuthNum(
    @Args('input') SendAuthNumInput: SendAuthNumInput,
  ): Promise<SendAuthNumOutput> {
    return await this.lectureService.sendAuthNum(SendAuthNumInput);
  }
  @Query(() => CheckAuthNumOutput)
  async CheckAuthNum(
    @Args('input') CheckAuthNumInput: CheckAuthNumInput,
  ): Promise<CheckAuthNumOutput> {
    return await this.lectureService.checkAuthNum(CheckAuthNumInput);
  }
}
