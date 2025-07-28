import { Module } from '@nestjs/common';
import { EntryController } from './index/entry.controller';
import { EntryService } from './index/entry.service';

@Module({
  controllers: [EntryController],
  providers: [EntryService],
})
export class EntryModule {}
