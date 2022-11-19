import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddStructorInput, AddStructorOutput } from './dto/add-structor.dto';
import { DeleteStructorInput, DeleteStructorOutput } from './dto/delete-structor.dto';
import { FindAllRoundsOutput } from './dto/find-all-round.dto';
import { Structor } from './entity/structors.entity';
import { StructorsService } from './structors.service';

@Resolver(() => Structor)
export class StructorsResolver {
    constructor(private readonly structorsService: StructorsService) { }
    @Mutation(() => AddStructorOutput)
    async AddStructor(
        @Args('input') addStructorInput: AddStructorInput,
    ): Promise<AddStructorOutput>{
        return await this.structorsService.addStructor(addStructorInput);
    }

    @Query(() => FindAllRoundsOutput)
    async FindAllRounds(): Promise<FindAllRoundsOutput>{
        return await this.structorsService.findAllRounds();
    }

    @Mutation(() => DeleteStructorOutput)
    async DeleteStructor(
        @Args('input') deleteStructorInput: DeleteStructorInput
    ): Promise<DeleteStructorOutput>{
        return await this.structorsService.deleteStructor(deleteStructorInput);
    }
}
