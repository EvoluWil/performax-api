import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Controller('companies/:companyId/partners')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Post()
  create(
    @Param('companyId') companyId: string,
    @Body() createPartnerDto: CreatePartnerDto,
  ) {
    return this.partnerService.create(createPartnerDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.partnerService.findAll(companyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerService.remove(id);
  }
}
