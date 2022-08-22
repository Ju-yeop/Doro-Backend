import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput, CreateUserOutput } from "./dtos/createUser.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
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
}