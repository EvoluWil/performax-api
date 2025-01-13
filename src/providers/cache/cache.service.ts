import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}
  async setValue(key: string, value: string, time: number): Promise<void> {
    await this.redis.set(key, value, 'EX', time);
  }

  async getValue(key: string): Promise<string | null> {
    return this.redis.get(key);
  }
}
