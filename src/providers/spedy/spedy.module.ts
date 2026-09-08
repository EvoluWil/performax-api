import { Module } from '@nestjs/common';
import { SpedyService } from './spedy.service';

@Module({
  providers: [SpedyService],
  exports: [SpedyService],
})
export class SpedyModule {}
