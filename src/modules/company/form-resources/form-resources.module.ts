import { Module } from '@nestjs/common';
import { FormResourcesController } from './form-resources.controller';
import { FormResourcesService } from './form-resources.service';

@Module({
  controllers: [FormResourcesController],
  providers: [FormResourcesService],
})
export class FormResourcesModule {}
