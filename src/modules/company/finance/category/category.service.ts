import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  create(createCategoryDto: CreateCategoryDto, companyId: string) {
    return this.prisma.companyFinanceCategory.create({
      data: {
        ...createCategoryDto,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.companyFinanceCategory.findMany({
      where: {
        companyId: companyId,
        deleted: false,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(categoryId: string, companyId: string) {
    const category = await this.prisma.companyFinanceCategory.findFirst({
      where: {
        id: categoryId,
        companyId: companyId,
        deleted: false,
      },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async update(
    categoryId: string,
    companyId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    await this.findOne(categoryId, companyId);

    return this.prisma.companyFinanceCategory.update({
      where: {
        id: categoryId,
      },
      data: updateCategoryDto,
    });
  }

  async remove(categoryId: string, companyId: string) {
    await this.findOne(categoryId, companyId);

    return this.prisma.companyFinanceCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
