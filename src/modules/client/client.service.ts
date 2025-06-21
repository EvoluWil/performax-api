import { BadRequestException, Injectable } from '@nestjs/common';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
  ) {}

  async create(companyId: string, createClientDto: CreateClientDto) {
    const { cnpj } = createClientDto;
    if (cnpj) {
      const client = await this.prisma.client.findFirst({
        where: { cnpj, companiesId: { has: companyId } },
      });

      if (client) {
        throw new BadRequestException('CNPJ já cadastrado!');
      }
    }

    return this.prisma.client.create({
      data: {
        ...createClientDto,
        companies: {
          connect: { id: companyId },
        },
      },
    });
  }

  async findAll(companyId: string) {
    const query = await this.qb.query('client');

    return await this.prisma.client.findMany({
      where: { companiesId: { has: companyId } },
      ...query,
    });
  }

  async findOne(id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id },
    });

    if (!client) {
      throw new BadRequestException('Cliente não encontrado!');
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.prisma.client.findFirst({
      where: { id },
    });

    if (!client) {
      throw new BadRequestException('Cliente não encontrado!');
    }

    if (updateClientDto?.cnpj) {
      const cnpjClient = await this.prisma.client.findFirst({
        where: { cnpj: updateClientDto.cnpj },
      });

      if (cnpjClient && client.cnpj && cnpjClient.cnpj !== client.cnpj) {
        throw new BadRequestException('CNPJ já cadastrado!');
      }
    }

    return this.prisma.client.update({
      where: { id },
      data: updateClientDto,
    });
  }

  async remove(id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id },
    });

    if (!client) {
      throw new BadRequestException('Cliente não encontrado!');
    }

    return await this.prisma.client.delete({
      where: { id },
    });
  }
}
