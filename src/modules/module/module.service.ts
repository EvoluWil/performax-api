import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createModuleDto: CreateModuleDto) {
    const codeAlreadyExists = await this.prisma.module.findUnique({
      where: {
        code: createModuleDto.code,
      },
    });

    if (codeAlreadyExists) {
      throw new ConflictException('Já existe um módulo com este código');
    }

    return this.prisma.module.create({
      data: createModuleDto,
    });
  }

  findAll() {
    return this.prisma.module.findMany({
      where: {
        deleted: false,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const moduleResult = await this.prisma.module.findUnique({
      where: {
        id,
        deleted: false,
      },
    });

    if (!moduleResult) {
      throw new NotFoundException('Módulo não encontrado');
    }

    return moduleResult;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    await this.findOne(id);

    if (updateModuleDto.code) {
      const codeAlreadyExists = await this.prisma.module.findUnique({
        where: {
          code: updateModuleDto.code,
        },
      });

      if (codeAlreadyExists && codeAlreadyExists.id !== id) {
        throw new ConflictException('Já existe um módulo com este código');
      }
    }

    return this.prisma.module.update({
      where: {
        id,
      },
      data: updateModuleDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.module.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }
}
