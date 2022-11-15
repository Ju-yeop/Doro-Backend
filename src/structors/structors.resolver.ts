import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AddStructorInput, AddStructorOutput } from './dtos/add-structor.dto';
import { Structor } from './entity/structors.entity';
import { StructorsService } from './structors.service';

@Resolver((of) => Structor)
export class StructorsResolver {
    constructor(private readonly structorsService: StructorsService) { }
    @Mutation(() => AddStructorOutput)
    async AddStructor(
        @Args('input') addStructorInput: AddStructorInput,
    ): Promise<AddStructorOutput>{
        return await this.structorsService.addStructor(addStructorInput);
    }
}
