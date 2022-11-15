import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddStructorInput, AddStructorOutput } from './dtos/add-structor.dto';
import { Structor } from './entity/structors.entity';

@Injectable()
export class StructorsService {
    constructor(
        @InjectRepository(Structor)
        private structor: Repository<Structor>
    ) {}
    async addStructor(addStructorInput: AddStructorInput): Promise<AddStructorOutput>{
        // Date, Round(시간)을 프론트에서 어떤 형식으로 받을거고 
        // 백에서 어떤 형식으로 가공해서 DB에 넣을 건지
        try {
            await this.structor.save(this.structor.create(addStructorInput));
            return { ok: true };
        } catch (error) {
            return { ok: false, error };
        }
    }
}
