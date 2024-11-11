import { Module } from '@nestjs/common';
import { OccurrenceTypeService } from './occurrence-type.service';
import { OccurrenceTypeController } from './occurrence-type.controller';

@Module({
  controllers: [OccurrenceTypeController],
  providers: [OccurrenceTypeService],
})
export class OccurrenceTypeModule {}
