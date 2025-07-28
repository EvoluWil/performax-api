import { Module } from '@nestjs/common';
import { OccurrenceController } from './index/occurrence.controller';
import { OccurrenceService } from './index/occurrence.service';

@Module({
  controllers: [OccurrenceController],
  providers: [OccurrenceService],
})
export class OccurrenceModule {}
