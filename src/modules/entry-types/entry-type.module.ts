import { Module } from '@nestjs/common';
import { EntryTypeController } from './entry-type.controller';
import { EntryTypeService } from './entry-type.service';

@Module({
  controllers: [EntryTypeController],
  providers: [EntryTypeService],
})
export class EntryTypeModule {}
