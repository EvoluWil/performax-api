import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ModuleService } from './module.service';

@Controller('companies/:companyId/modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Post(':moduleId')
  create(
    @Param('companyId') companyId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.moduleService.create(moduleId, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.moduleService.findAll(companyId);
  }

  @Delete(':moduleId')
  remove(
    @Param('moduleId') moduleId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.moduleService.remove(moduleId, companyId);
  }
}
