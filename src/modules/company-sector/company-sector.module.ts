import { Module } from '@nestjs/common';
import { CompanySectorController } from './company-sector.controller';
import { CompanySectorService } from './company-sector.service';

@Module({
  controllers: [CompanySectorController],
  providers: [CompanySectorService],
})
export class CompanySectorModule {}
