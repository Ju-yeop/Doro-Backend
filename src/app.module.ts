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
import { StructorsModule } from './structors/structors.module';
import { Structor } from './structors/entity/structors.entity';
import { Client } from './lectures/entities/client.entity';
import { Detail_class_info } from './lectures/entities/detail_class_info.entity';
import { Overall_class_info } from './lectures/entities/overall_class_info.entity';
import { LectureMdoule } from './lectures/lectures.module';
import { RedisCacheModule } from './cache/redis-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.dev',
      ignoreEnvFile: false, //process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production').required(),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        PRIVATE_KEY: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : process.env.NODE_ENV === 'dev'
        ? {
            host: process.env.DBL_HOST,
            port: +process.env.DBL_PORT,
            username: process.env.DBL_USERNAME,
            password: process.env.DBL_PASSWORD,
            database: process.env.DBL_NAME,
          }
        : {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          }),
      synchronize: true,
      logging: true,
      entities: [
        User,
        Post,
        Comment,
        Structor,
        Client,
        Detail_class_info,
        Overall_class_info,
      ],
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug: false,
      playground: true,
      autoSchemaFile: true,
      context: ({ req }) => ({ user: req['user'] }),
    }),
    RedisCacheModule,
    UsersModule,
    PostModule,
    AuthModule,
    StructorsModule,
    LectureMdoule,
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
