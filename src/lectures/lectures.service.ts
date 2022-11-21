import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Client)
    private client: Repository<Client>,
    @InjectRepository(Detail_class_info)
    private detail_class_info: Repository<Detail_class_info>,
    @InjectRepository(Overall_class_info)
    private overall_class_info: Repository<Overall_class_info>,
    private cacheManager: RedisCacheService,
  ) {}
  async sendAuthNum(
    SendAuthNumInput: SendAuthNumInput,
  ): Promise<SendAuthNumOutput> {
    if (SendAuthNumInput.Option === sendOption.mypage) {
      //readbyuserid
      return { ok: false, error: '유저가 존재하지 않습니다.' };
    }

    //랜덤 인증번호 생성
    let randomNum = '';
    for (let i = 0; i < 6; i++) {
      randomNum += Math.floor(Math.random() * 10);
    }

    //redis 에 핸드폰번호: 인증번호로 저장
    await this.cacheManager.set(
      `${SendAuthNumInput.phoneNumber}`,
      `${randomNum}`,
    );

    //카카오 보내기 (임시 템플릿)
    const messageService = new SolapiMessageService(
      process.env.SOLAPIKEY,
      process.env.SOLAPISECRETKEY,
    );

    messageService
      .sendOne({
        to: '01075585082',
        from: process.env.PHONE_NUMBER,
        kakaoOptions: {
          pfId: process.env.KAKAOPFID,
          templateId: 'KA01TP221013112749783YFgBRxkPdcG',
          disableSms: false,
          adFlag: false,
          variables: {
            '#{성함}': randomNum,
            '#{소속기관}': randomNum,
            '#{연락처}': randomNum,
            '#{글 제목}': randomNum,
            '#{글 내용}': randomNum,
            '#{url}': randomNum,
          },
        },
        autoTypeDetect: true,
      })
      .then((res) => console.log(res));

    return { ok: true };
  }
  async checkAuthNum(
    CheckAuthNumInput: CheckAuthNumInput,
  ): Promise<CheckAuthNumOutput> {
    return;
  }
}
