import { Injectable, NotFoundException } from '@nestjs/common';
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
  create(createClientDto: CreateClientDto, companyId: string) {
    return this.prisma.companyClient.create({
      data: {
        ...createClientDto,
        company: { connect: { id: companyId } },
      },
    });
  }

  async findAll(companyId: string) {
    const where = { companyId, deleted: false };
    const { count, query } = await this.qb.query('companyClient', where);
    const clients = await this.prisma.companyClient.findMany({
      ...query,
    });

    return { count, data: clients };
  }

  async findOne(clientId: string, companyId: string) {
    const client = await this.prisma.companyClient.findUnique({
      where: { id: clientId, companyId, deleted: false },
    });

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    return client;
  }

  async update(
    clientId: string,
    companyId: string,
    updateClientDto: UpdateClientDto,
  ) {
    await this.findOne(clientId, companyId);
    return this.prisma.companyClient.update({
      where: { id: clientId, companyId },
      data: updateClientDto,
    });
  }

  async remove(clientId: string, companyId: string) {
    await this.findOne(clientId, companyId);
    return this.prisma.companyClient.update({
      where: { id: clientId, companyId },
      data: { deleted: true },
    });
  }
}
