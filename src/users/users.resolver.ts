/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import { CreateUserInput, CreateUserOutput } from './dtos/createUser.dto';
import { deleteUserInput, deleteUserOutput } from './dtos/deleteUser.dto';
import { editUserInput, editUserOutput } from './dtos/editUser.dto';
import { findUserInput, findUserOutput } from './dtos/findUser.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation((returns) => CreateUserOutput)
  async createUser(
    @Args('input') createUserInput: CreateUserInput,
  ): Promise<CreateUserOutput> {
    return this.userService.createUser(createUserInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.userService.login(loginInput);
  }

  @Query((returns) => findUserOutput)
  @Role(['Any'])
  async findUser(
    @Args() findUserInput: findUserInput,
  ): Promise<findUserOutput> {
    return this.userService.findById(findUserInput.userId);
  }

  @Query((returns) => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Mutation((returns) => editUserOutput)
  @Role(['Any'])
  async editUser(
    @AuthUser() authUser: User,
    @Args('input') userEditInput: editUserInput,
  ): Promise<editUserOutput> {
    return this.userService.editUser(authUser.id, userEditInput);
  }

  @Mutation(() => deleteUserOutput)
  @Role(['Any'])
  async deleteUser(
    @AuthUser() AuthUser: User,
    @Args('input') deleteUserInput: deleteUserInput,
  ): Promise<deleteUserOutput> {
    return this.userService.deleteUser(AuthUser, deleteUserInput);
  }
}
