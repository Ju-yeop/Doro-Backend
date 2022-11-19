import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddStructorInput, AddStructorOutput } from './dto/add-structor.dto';
import { DeleteStructorInput, DeleteStructorOutput } from './dto/delete-structor.dto';
import { FindAllRoundsOutput } from './dto/find-all-round.dto';
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

    async findAllRounds(): Promise<FindAllRoundsOutput>{
        try {
            const rounds = await this.structor.find()
            return {
                ok: true,
                rounds
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }

    async deleteStructor({structorId}: DeleteStructorInput): Promise<DeleteStructorOutput>{
        try {
            const structor = await this.structor.findOne({
                where:{id:structorId}
            })
            if (!structor) {
                return {
                    ok: false,
                    error: "There is no structor"
                }
            }
            await this.structor.delete({ id: structor.id })
            return {
                ok:true
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }
}
