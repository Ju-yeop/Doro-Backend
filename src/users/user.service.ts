import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput, CreateUserOutput } from "./dtos/createUser.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";
import { User } from "./entities/user.entity";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { findUserOutput } from "./dtos/findUser.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private readonly config: ConfigService,
    ) { }
    
    async createUser({
        email,
        password,
        name,
        role,
    }: CreateUserInput): Promise<CreateUserOutput>{
        try {
            const exist = await this.users.findOne({ where: { email } })
        if (exist) {
            return {ok:false, error:'There is a user with that email already'}
        }
        await this.users.save(this.users.create({ email, password, name, role }))
        return { ok: true }
        } catch (error) {
            return {ok: false, error}
        }
    }

    async login({
        email,
        password
    }: LoginInput): Promise<LoginOutput>{
        try {
            const user = await this.users.findOne({ where: { email }, select: ['id', 'password'] })
            if (!user) {
                return { ok: false, error:"User not Found"}
            }
            const passwordCorrect = await user.checkPassword(password);
            if (!passwordCorrect) {
                return { ok: false, error:"Wrong Password"}
            }
            const token = jwt.sign({id:user.id}, this.config.get('PRIVATE_KEY'));
            return {
                ok: true,
                token
            }
        } catch (error) {
            return { ok: false, error}
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
}