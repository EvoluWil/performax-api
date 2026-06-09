import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { ApplyAdjustmentDto } from './dto/apply-adjustment.dto';
import { TypeService } from './type.service';

@Controller('companies/:companyId/contract-types')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post()
  create(
    @Body() createTypeDto: CreateTypeDto,
    @Param('companyId') companyId: string,
  ) {
    return this.typeService.create(createTypeDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.typeService.findAll(companyId);
  }

  @Put(':typeId')
  update(
    @Param('typeId') typeId: string,
    @Param('companyId') companyId: string,
    @Body() updateTypeDto: UpdateTypeDto,
  ) {
    return this.typeService.update(typeId, companyId, updateTypeDto);
  }

  @Delete(':typeId')
  remove(
    @Param('typeId') typeId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.typeService.remove(typeId, companyId);
  }

  @Post(':typeId/adjustments')
  applyAdjustment(
    @Param('typeId') typeId: string,
    @Param('companyId') companyId: string,
    @Body() applyAdjustmentDto: ApplyAdjustmentDto,
  ) {
    return this.typeService.applyAdjustment(
      typeId,
      companyId,
      applyAdjustmentDto,
    );
  }
}
