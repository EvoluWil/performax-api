import { Body, Controller, Param, Post } from '@nestjs/common';
import { FormResourcesDto } from './dto/form-resources.dto';
import { FormResourcesService } from './form-resources.service';

@Controller('companies/:companyId/form-resources')
export class FormResourcesController {
  constructor(private readonly service: FormResourcesService) {}

  @Post()
  findResources(
    @Param('companyId') companyId: string,
    @Body() dto: FormResourcesDto,
  ) {
    return this.service.findResources(companyId, dto);
  }
}
