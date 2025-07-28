import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(moduleId: string, companyId: string) {
    const companyModule = await this.prisma.companyModule.findFirst({
      where: {
        companyId: companyId,
        moduleId: moduleId,
      },
    });

    if (companyModule) {
      throw new ConflictException('Módulo já associado à esta empresa');
    }

    return this.prisma.companyModule.create({
      data: {
        module: {
          connect: { id: moduleId },
        },
        company: {
          connect: { id: companyId },
        },
      },
    });
  }

  findAll(companyId: string) {
    console.log('companyId', companyId);
    this.prisma.companyModule.findMany().then((modules) => {
      console.log('modules', modules);
      return modules;
    });

    return this.prisma.companyModule.findMany({
      where: { companyId: companyId },
      include: {
        module: true,
      },
    });
  }

  async remove(moduleId: string, companyId: string) {
    const companyModule = await this.prisma.companyModule.findFirst({
      where: {
        companyId: companyId,
        moduleId: moduleId,
      },
    });

    if (!companyModule) {
      throw new NotFoundException('Módulo não associado à esta empresa');
    }

    return this.prisma.companyModule.delete({
      where: {
        id: companyModule.id,
      },
    });
  }
}
