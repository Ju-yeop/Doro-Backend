import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-ioredis';
import { RedisCacheService } from './redis-cache.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      //@ts-ignore
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      ttl: 0,
      isGlobal: true,
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
