import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateSegmentDto } from './dto/create-segment.dto';
import { UpdateSegmentDto } from './dto/update-segment.dto';
import { SegmentService } from './segment.service';

@Controller('companies/:companyId/finance-segments')
export class SegmentController {
  constructor(private readonly segmentService: SegmentService) {}

  @Post()
  create(
    @Body() createSegmentDto: CreateSegmentDto,
    @Param('companyId') companyId: string,
  ) {
    return this.segmentService.create(createSegmentDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.segmentService.findAll(companyId);
  }

  @Put(':segmentId')
  update(
    @Param('segmentId') segmentId: string,
    @Param('companyId') companyId: string,
    @Body() updateSegmentDto: UpdateSegmentDto,
  ) {
    return this.segmentService.update(segmentId, companyId, updateSegmentDto);
  }

  @Delete(':segmentId')
  remove(
    @Param('segmentId') segmentId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.segmentService.remove(segmentId, companyId);
  }
}
