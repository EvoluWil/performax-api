import { Global, Module } from '@nestjs/common';
import { Querybuilder } from 'nestjs-prisma-querybuilder';
import { QBService } from './prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  imports: [],
  providers: [PrismaService, QBService, Querybuilder],
  exports: [PrismaService, QBService],
})
export class PrismaModule {}
