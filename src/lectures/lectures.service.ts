import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEduInput, CreateEduOutput } from './dto/create-edu.dto';
import { FindOverallClassesInput, FindOverallClassesOutput } from './dto/find-overall-classes.dto';
import { Client } from './entities/client.entity';
import { Detail_class_info } from './entities/detail_class_info.entity';
import { Overall_class_info } from './entities/overall_class_info.entity';

@Injectable()
export class LectureService {
  constructor(
    @InjectRepository(Client)
    private client: Repository<Client>,
    @InjectRepository(Detail_class_info)
    private detail_class_info: Repository<Detail_class_info>,
    @InjectRepository(Overall_class_info)
    private overall_class_info: Repository<Overall_class_info>
  ) {}

  async createEdu({
    name,
    institution_name,
    position,
    phone_number,
    email,
    student_count,
    school_rank,
    grade,
    budget,
    overall_remark,
    detail_classes,
  }: CreateEduInput): Promise<CreateEduOutput> {
    try {
      const details: Detail_class_info[] = [];
      const client = await this.client.findOne({
        where: { name, phone_number },
      });
      console.log(client);
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
        grade,
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

  async findOverallClasses(
    {clientId}: FindOverallClassesInput
  ): Promise<FindOverallClassesOutput> {
    try {
      const overallClasses = await this.overall_class_info.find({ where: { client:{id:clientId} }, select: {Detail_class_infos:false} });
      return {
        ok: true,
        overallClasses
      }  
    } catch (error) {
      return {
        ok: false,
        error
      }
    }
    
  }
}
