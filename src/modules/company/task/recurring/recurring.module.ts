import { Module } from '@nestjs/common';
import { RecurringController } from 'src/modules/company/task/recurring/recurring.controller';
import { RecurringService } from 'src/modules/company/task/recurring/recurring.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { UtilService } from 'src/providers/util/util.service';

@Module({
  providers: [RecurringService, PrismaService, UtilService],
  controllers: [RecurringController],
  exports: [RecurringService],
})
export class RecurringModule {}
