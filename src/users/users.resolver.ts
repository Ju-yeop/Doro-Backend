/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, CreateUserOutput } from './dtos/createUser.dto';
import { findUserInput, findUserOutput } from './dtos/findUser.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
constructor(private readonly userService: UserService){}

  @Mutation((returns) => CreateUserOutput)
  async createUser(
    @Args('input') createUserInput: CreateUserInput): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(
    @Args('input') loginInput: LoginInput): Promise<LoginOutput>{
    return this.userService.login(loginInput);
  }
  
  @Query((returns) => findUserOutput)
  async findUser(
    @Args() findUserInput: findUserInput,
  ): Promise<findUserOutput> {
    return this.userService.findById(findUserInput.userId);
  }

  @Query((returns) => User)
  me(@Context() context) {
    console.log("");
  }
}
