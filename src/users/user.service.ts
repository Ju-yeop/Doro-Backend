import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/createUser.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { findUserOutput } from './dtos/findUser.dto';
import { editUserInput, editUserOutput } from './dtos/editUser.dto';
import { deleteUserInput, deleteUserOutput } from './dtos/deleteUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async createUser({
    email,
    password,
    name,
    role,
  }: CreateUserInput): Promise<CreateUserOutput> {
    try {
      const exist = await this.users.findOne({ where: { email } });
      if (exist) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      await this.users.save(this.users.create({ email, password, name, role }));
      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.users.findOne({
        where: { email },
        select: ['id', 'password'],
      });
      if (!user) {
        return { ok: false, error: 'User not Found' };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return { ok: false, error: 'Wrong Password' };
      }
      const token = jwt.sign({ id: user.id }, this.config.get('PRIVATE_KEY'));
      console.log(token);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async findById(id: number): Promise<findUserOutput> {
    try {
      const user = await this.users.findOneOrFail({ where: { id } });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async editUser(
    userId: number,
    { email, password, name }: editUserInput,
  ): Promise<editUserOutput> {
    try {
      const user = await this.users.findOne({ where: { id: userId } });
      if (email) {
        const exist = await this.users.findOne({ where: { email } });
        if (exist) {
          return {
            ok: false,
            error: 'There is a user with that email already',
          };
        }
        user.email = email;
      }
      if (password) {
        user.password = password;
      }
      if (name) {
        user.name = name;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not update profile.' };
    }
  }
  async deleteUser(
    user: User,
    deleteUserInput: deleteUserInput,
  ): Promise<deleteUserOutput> {
    try {
      const targetUser = await this.users.find({
        where: {
          id: deleteUserInput.UserId,
        },
      });
      if (!targetUser) {
        return {
          ok: false,
          error: 'no user',
        };
      }
      if (user.id === deleteUserInput.UserId) {
        await this.users.delete(deleteUserInput.UserId);
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: 'can not delete',
        };
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
