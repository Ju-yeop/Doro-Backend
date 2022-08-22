import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { UserService } from "src/users/user.service";
import * as jwt from "jsonwebtoken"
import { ConfigService } from "@nestjs/config";

@Injectable()
export class jwtMiddleware implements NestMiddleware {
    constructor(
        private readonly userService: UserService,
        private readonly config: ConfigService,
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {
        if ('x-jwt' in req.headers) {
            const token = req.headers['x-jwt'];
            try {
                const decoded = jwt.verify(token.toString(), this.config.get('PRIVATE_KEY'));
                if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
                    const { user }  = await this.userService.findById(decoded['id']);
                    req['user'] = user;
                }
            } catch (error) {}
        }
        next();
    }
}