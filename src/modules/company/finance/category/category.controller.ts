import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('companies/:companyId/finance-categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('companyId') companyId: string,
  ) {
    return this.categoryService.create(createCategoryDto, companyId);
  }

  @Get()
  findAll(@Param('companyId') companyId: string) {
    return this.categoryService.findAll(companyId);
  }

  @Put(':categoryId')
  update(
    @Param('categoryId') categoryId: string,
    @Param('companyId') companyId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(
      categoryId,
      companyId,
      updateCategoryDto,
    );
  }

  @Delete(':categoryId')
  remove(
    @Param('categoryId') categoryId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.categoryService.remove(categoryId, companyId);
  }
}
