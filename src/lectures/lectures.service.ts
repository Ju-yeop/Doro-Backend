import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateEduInput, CreateEduOutput } from './dto/create-edu.dto';
import { FindAllLecturesOutput } from './dto/find-all-lectures.dto';
import {
  FindOverallClassInput,
  FindOverallClassOutput,
} from './dto/find-overall-class.dto';
import {
  FindOverallClassesInput,
  FindOverallClassesOutput,
} from './dto/find-overall-classes.dto';
import {
  CheckAuthNumInput,
  CheckAuthNumOutput,
} from './dtos/check-auth-num.dto';
import {
  SendAuthNumInput,
  SendAuthNumOutput,
  sendOption,
} from './dtos/send-auth-num.dto';
import { Client } from './entities/client.entity';
import { Detail_class_info } from './entities/detail_class_info.entity';
import { Overall_class_info } from './entities/overall_class_info.entity';
import { RedisCacheService } from 'src/cache/redis-cache.service';
import { SolapiMessageService } from 'solapi';
import {
  DeleteOverallClassInput,
  DeleteOverallClassOutput,
} from './dto/delete-overall-class.dto';
import { UpdateEduInput, UpdateEduOutput } from './dto/update-edu.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Client)
    private client: Repository<Client>,
    @InjectRepository(Detail_class_info)
    private detail_class_info: Repository<Detail_class_info>,
    @InjectRepository(Overall_class_info)
    private overall_class_info: Repository<Overall_class_info>,
    private cacheManager: RedisCacheService
  ) {}

  async createEdu({
    name,
    institution_name,
    position,
    phone_number,
    email,
    student_count,
    school_rank,
    budget,
    overall_remark,
    detail_classes,
  }: CreateEduInput): Promise<CreateEduOutput> {
    try {
      const details: Detail_class_info[] = [];
      const client = await this.client.findOne({
        where: { name, phone_number },
      });
      if (!client) {
        // client가 없을 경우
        const newClient = this.client.create({
          name,
          institution_name,
          position,
          phone_number,
          email,
        });
        await createAndSave_Class(
          newClient,
          details,
          this.client,
          this.overall_class_info,
          this.detail_class_info,
          false
        );
        return {
          ok: true,
        };
      }
      // client가 이미 있을 경우
      await createAndSave_Class(
        client,
        details,
        this.client,
        this.overall_class_info,
        this.detail_class_info,
        true
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }

    async function createAndSave_Class(
      client_arg: Client,
      details: Detail_class_info[],
      client_info: Repository<Client>,
      overall_class_info: Repository<Overall_class_info>,
      detail_class_info: Repository<Detail_class_info>,
      exist: boolean
    ) {
      const overall_class = overall_class_info.create({
        student_count,
        school_rank,
        budget,
        overall_remark,
        client: client_arg,
      });
      if (client_arg.Overall_class_infos) {
        client_arg.Overall_class_infos.push(overall_class);
      } else {
        client_arg.Overall_class_infos = [overall_class];
      }
      for (const item of detail_classes) {
        const detail_class = detail_class_info.create({
          class_name: item.class_name,
          student_number: item.student_number,
          date: item.date,
          remark: item.remark,
          unfixed: item.unfixed,
          Overall_class_info: overall_class,
        });
        //detail_class.Overall_class_info = overall_class;
        //await detail_class_info.save(detail_class);
        details.push(detail_class);
      }
      overall_class.Detail_class_infos = details;
      await detail_class_info.save(details);
      await overall_class_info.save(overall_class);
      if (exist) {
        // const clientId = client_arg.id
        // await client_info.update({ id: clientId }, { Overall_class_infos: [...client_arg.Overall_class_infos] });
      } else {
        await client_info.save(client_arg);
      }
    }
  }

  async findOverallClasses({
    phone_number,
    name,
  }: FindOverallClassesInput): Promise<FindOverallClassesOutput> {
    try {
      const overallClasses = await this.overall_class_info.find({
        where: { client: { name, phone_number } },
        select: { Detail_class_infos: false },
      });
      return {
        ok: true,
        overallClasses,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findOverallClass({
    overall_Class_Id,
  }: FindOverallClassInput): Promise<FindOverallClassOutput> {
    try {
      const overallClass = await this.overall_class_info.findOne({
        where: { id: overall_Class_Id },
        relations: ['Detail_class_infos', 'client'],
      });
      const client = await this.client.findOne({
        where: { id: overallClass.client.id },
      });
      if (!overallClass) {
        return {
          ok: false,
          error: '신청하신 강의가 존재하지 않습니다.',
        };
      }
      if (!client) {
        return {
          ok: false,
          error: '잘못된 접근입니다.',
        };
      }
      return {
        ok: true,
        overallClass,
        client,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findAllLectures(): Promise<FindAllLecturesOutput> {
    try {
      const results = await this.overall_class_info.find({
        relations: ['Detail_class_infos'],
      });
      return {
        ok: true,
        results,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  async sendAuthNum(
    SendAuthNumInput: SendAuthNumInput
  ): Promise<SendAuthNumOutput> {
    //mypage 조회시 유저 존재 여부 확인
    if (SendAuthNumInput.Option === sendOption.mypage) {
      const client = await this.client.findOne({
        where: {
          name: SendAuthNumInput.name,
          phone_number: SendAuthNumInput.phoneNumber,
        },
      });
      if (!client) {
        console.log('fasle');
        return { ok: false, error: '유저가 존재하지 않습니다.' };
      }
      console.log('pass');
    }

    //랜덤 인증번호 생성
    let randomNum = '';
    for (let i = 0; i < 6; i++) {
      randomNum += Math.floor(Math.random() * 10);
    }

    //redis 에 핸드폰번호: 인증번호로 저장
    await this.cacheManager.set(
      `${SendAuthNumInput.phoneNumber}`,
      `${randomNum}`
    );

    //카카오 보내기 (임시 템플릿)
    const messageService = new SolapiMessageService(
      process.env.SOLAPIKEY,
      process.env.SOLAPISECRETKEY
    );

    messageService
      .sendOne({
        to: SendAuthNumInput.phoneNumber,
        from: process.env.PHONE_NUMBER,
        kakaoOptions: {
          pfId: process.env.KAKAOPFID,
          templateId: 'KA01TP221122102256138lqFxmnHR9q2',
          disableSms: false,
          adFlag: false,
          variables: {
            '#{인증번호}': randomNum,
          },
        },
        autoTypeDetect: true,
      })
      .then((res) => console.log(res));

    return { ok: true };
  }
  async checkAuthNum(
    CheckAuthNumInput: CheckAuthNumInput
  ): Promise<CheckAuthNumOutput> {
    const authNum = await this.cacheManager.get(
      `${CheckAuthNumInput.phoneNumber}`
    );
    if (!authNum) {
      return {
        ok: false,
        error: '인증번호가 없습니다 재전송을 눌러주세요',
      };
    } else {
      if (authNum === CheckAuthNumInput.authNum) {
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: '인증번호가 일치하지 않습니다 다시 시도해 주세요',
        };
      }
    }
  }

  async deleteOverallClassInput({
    overallClassId,
  }: DeleteOverallClassInput): Promise<DeleteOverallClassOutput> {
    try {
      const targetClass = await this.overall_class_info.findOne({
        where: {
          id: overallClassId,
        },
      });
      if (!targetClass) {
        return {
          ok: false,
          error: '신청 내역이 없습니다',
        };
      }
      await this.overall_class_info.delete({ id: overallClassId });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async updateEdu({
    overallId,
    detail_classes,
    overall_class,
  }: UpdateEduInput): Promise<UpdateEduOutput> {
    try {
      const old_overall = await this.overall_class_info.findOne({
        where: { id: overallId },
      });
      if (!old_overall) {
        return {
          ok: false,
          error: '시스템 에러',
        };
      }
      await this.overall_class_info.update(overallId, { ...overall_class });

      const details = await this.detail_class_info.find({
        where: { Overall_class_info: { id: overallId } },
        select: { id: true },
      });
      if (details) {
        for (const detail of details) {
          await this.detail_class_info.delete({ id: detail.id });
        }
      }
      for (const item of detail_classes) {
        await this.detail_class_info.save(
          this.detail_class_info.create({
            ...item,
            Overall_class_info: old_overall,
          })
        );
      }
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
