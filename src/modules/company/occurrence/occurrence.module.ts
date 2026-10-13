import { Module } from '@nestjs/common';
import { NotificationModule } from '../notification/notification.module';
import { OccurrenceController } from './index/occurrence.controller';
import { OccurrenceService } from './index/occurrence.service';
import { TypeModule } from './type/type.module';

@Module({
  controllers: [OccurrenceController],
  providers: [OccurrenceService],
  imports: [TypeModule, NotificationModule],
})
export class OccurrenceModule {}
