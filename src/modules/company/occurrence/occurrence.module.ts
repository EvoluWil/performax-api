import { Module } from '@nestjs/common';
import { OccurrenceController } from './index/occurrence.controller';
import { OccurrenceService } from './index/occurrence.service';
import { TypeModule } from './type/type.module';

@Module({
  controllers: [OccurrenceController],
  providers: [OccurrenceService],
  imports: [TypeModule],
})
export class OccurrenceModule {}
