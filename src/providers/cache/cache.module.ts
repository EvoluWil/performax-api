import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { CacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis(process.env.REDIS_URL);
      },
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
