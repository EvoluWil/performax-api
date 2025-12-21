import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypeService {
  constructor(private readonly prisma: PrismaService) {}
  create(createTypeDto: CreateTypeDto, companyId: string) {
    return this.prisma.companyBudgetType.create({
      data: {
        ...createTypeDto,
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.companyBudgetType.findMany({
      where: {
        companyId: companyId,
        deleted: false,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(typeId: string, companyId: string) {
    const type = await this.prisma.companyBudgetType.findFirst({
      where: {
        id: typeId,
        companyId: companyId,
        deleted: false,
      },
    });

    if (!type) {
      throw new NotFoundException('Tipo não encontrado');
    }

    return type;
  }

  async update(
    typeId: string,
    companyId: string,
    updateTypeDto: UpdateTypeDto,
  ) {
    await this.findOne(typeId, companyId);

    return this.prisma.companyBudgetType.update({
      where: {
        id: typeId,
      },
      data: updateTypeDto,
    });
  }

  async remove(typeId: string, companyId: string) {
    await this.findOne(typeId, companyId);

    return this.prisma.companyBudgetType.update({
      where: {
        id: typeId,
      },
      data: {
        deleted: true,
      },
    });
  }
}
