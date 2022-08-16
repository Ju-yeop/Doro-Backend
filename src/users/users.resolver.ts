/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => [User])
  users(@Args('input') nickname: boolean): User[] {
    return [];
  }
}
