import { Body, Controller, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { FormResourcesDto } from './dto/form-resources.dto';
import { FormResourcesService } from './form-resources.service';

@Controller('companies/:companyId/form-resources')
export class FormResourcesController {
  constructor(private readonly service: FormResourcesService) {}

  @Post()
  findResources(
    @Param('companyId') companyId: string,
    @AuthUser() user: User,
    @Body() dto: FormResourcesDto,
  ) {
    return this.service.findResources(companyId, user.id, dto);
  }
}
