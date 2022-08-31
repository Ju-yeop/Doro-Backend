/* eslint-disable prettier/prettier */
import { ApolloDriver } from '@nestjs/apollo';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { User } from './users/entities/user.entity';
import { PostModule } from './posts/posts.module';
import { Comment } from './posts/entity/comment.entity';
import { Post } from './posts/entity/post.entity';
import { PostService } from './posts/posts.service';
import { jwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'production',
      logging: true,
      entities: [User, Post, Comment],
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug: false,
      playground: process.env.NODE_ENV !== 'production',
      autoSchemaFile: true,
      context: ({ req }) => ({ user: req['user'] }),
    }),
    UsersModule,
    PostModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(jwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
