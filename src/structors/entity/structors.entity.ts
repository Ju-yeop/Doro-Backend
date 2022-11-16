/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNumber, IsString } from "class-validator";
import { Core } from "src/common/entity/core.entity";
import { Column, Entity } from "typeorm";

@InputType('AddStructorInput', {isAbstract:true})
@ObjectType()
@Entity()
export class Structor extends Core {
    @Column()
    @Field((type) => String)
    @IsString()
    date: string;

    @Column()
    @Field((type) => Number)
    @IsNumber()
    round: number
    
    @Column()
    @Field((type) => Number, {defaultValue: 0})
    @IsNumber()
    available_structor: number
}