import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IsSystemAdmin } from 'src/decorators/system-admin.decorator';
import { ChangelogService } from './changelog.service';
import { CreateChangelogDto } from './dto/create-changelog.dto';
import { UpdateChangelogDto } from './dto/update-changelog.dto';

@Controller('changelog')
export class ChangelogController {
  constructor(private readonly changelogService: ChangelogService) {}

  @IsSystemAdmin()
  @Post()
  create(@Body() createChangelogDto: CreateChangelogDto) {
    return this.changelogService.create(createChangelogDto);
  }

  @Get()
  findAll() {
    return this.changelogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.changelogService.findOne(id);
  }

  @IsSystemAdmin()
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateChangelogDto: UpdateChangelogDto,
  ) {
    return this.changelogService.update(id, updateChangelogDto);
  }

  @IsSystemAdmin()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.changelogService.remove(id);
  }
}
