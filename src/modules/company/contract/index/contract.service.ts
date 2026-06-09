import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FinanceFlowEnum, FinanceStatusEnum } from '@prisma/client';
import { RecurringService } from 'src/modules/company/finance/recurring/recurring.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { normalizeRelations } from 'src/utils/normalize-relations.util';
import { CreateContractDto } from './dto/create-contract.dto';
import { GenerateRecurringDto } from './dto/generate-recurring.dto';
import { SignedAttachmentDto } from './dto/signed-attachment.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

const contractIncludes = {
  client: { select: { id: true, name: true, cnpj: true, address: true } },
  type: {
    select: {
      id: true,
      name: true,
      lastAdjustmentPercentage: true,
      lastAdjustmentAt: true,
    },
  },
  createdBy: { select: { id: true, name: true } },
};

function buildMonthlyRRule(dueDate: Date): string {
  const day = dueDate.getUTCDate();
  return `FREQ=MONTHLY;BYMONTHDAY=${day}`;
}

@Injectable()
export class ContractService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
    private readonly recurringService: RecurringService,
  ) {}

  async create(
    createContractDto: CreateContractDto,
    companyId: string,
    userId: string,
  ) {
    const data = normalizeRelations(createContractDto) as any;

    return this.prisma.companyContract.create({
      data: {
        ...data,
        active: true,
        company: { connect: { id: companyId } },
        createdBy: { connect: { id: userId } },
      },
      include: contractIncludes,
    });
  }

  async findAll(companyId: string) {
    const where = { companyId, deleted: false };
    const { count, query } = await this.qb.query('companyContract', where);
    const contracts = await this.prisma.companyContract.findMany({
      ...query,
    });

    return { count, data: contracts };
  }

  async findOne(contractId: string, companyId: string) {
    const contract = await this.prisma.companyContract.findUnique({
      where: { id: contractId, companyId, deleted: false },
      include: contractIncludes,
    });

    if (!contract) {
      throw new NotFoundException('Contrato não encontrado');
    }

    return contract;
  }

  async update(
    contractId: string,
    companyId: string,
    updateContractDto: UpdateContractDto,
  ) {
    await this.findOne(contractId, companyId);

    return this.prisma.companyContract.update({
      where: { id: contractId },
      data: updateContractDto,
      include: contractIncludes,
    });
  }

  private async cancelFutureFinances(recurringId: string) {
    const now = new Date();

    await this.prisma.companyFinance.updateMany({
      where: {
        recurrenceMasterId: recurringId,
        date: { gte: now },
        status: {
          in: [FinanceStatusEnum.PENDING, FinanceStatusEnum.APPROVED],
        },
        deleted: false,
      },
      data: { status: FinanceStatusEnum.CANCELLED },
    });

    await this.prisma.companyFinanceRecurring.update({
      where: { id: recurringId },
      data: { endDate: now },
    });
  }

  async remove(contractId: string, companyId: string) {
    const contract = await this.findOne(contractId, companyId);

    if (contract.recurringId) {
      await this.cancelFutureFinances(contract.recurringId);
    }

    return this.prisma.companyContract.update({
      where: { id: contractId },
      data: { deleted: true, active: false },
    });
  }

  async updateSignedAttachment(
    contractId: string,
    companyId: string,
    { attachment }: SignedAttachmentDto,
  ) {
    await this.findOne(contractId, companyId);

    return this.prisma.companyContract.update({
      where: { id: contractId },
      data: { attachment },
      include: contractIncludes,
    });
  }

  async inactivate(contractId: string, companyId: string) {
    const contract = await this.findOne(contractId, companyId);

    if (contract.recurringId) {
      await this.cancelFutureFinances(contract.recurringId);
    }

    return this.prisma.companyContract.update({
      where: { id: contractId },
      data: { active: false },
      include: contractIncludes,
    });
  }

  async activate(contractId: string, companyId: string) {
    await this.findOne(contractId, companyId);

    return this.prisma.companyContract.update({
      where: { id: contractId },
      data: { active: true },
      include: contractIncludes,
    });
  }

  async generateRecurring(
    contractId: string,
    companyId: string,
    userId: string,
    dto: GenerateRecurringDto,
  ) {
    const contract = await this.prisma.companyContract.findUnique({
      where: { id: contractId, companyId, deleted: false },
      include: {
        client: { select: { id: true, name: true } },
        type: { select: { id: true, name: true } },
      },
    });

    if (!contract) {
      throw new NotFoundException('Contrato não encontrado');
    }

    if (!contract.active) {
      throw new BadRequestException(
        'Contrato inativo não pode gerar recorrência',
      );
    }

    if (contract.recurringId) {
      throw new BadRequestException('Contrato já possui recorrência vinculada');
    }

    if (!contract.dueDate) {
      throw new BadRequestException(
        'Contrato precisa ter data de vencimento para gerar recorrência',
      );
    }

    const recurrence =
      dto.recurrence ?? buildMonthlyRRule(new Date(contract.dueDate));
    const flow = dto.flow ?? FinanceFlowEnum.IN;
    const title = `Contrato - ${contract.client.name} - ${contract.type.name}`;

    const recurring = await this.prisma.companyFinanceRecurring.create({
      data: {
        title,
        description: contract.scope ?? undefined,
        value: contract.value,
        date: contract.dueDate,
        flow,
        recurrence,
        endDate: contract.endDate ?? undefined,
        lastDate: contract.dueDate,
        company: { connect: { id: companyId } },
        client: { connect: { id: contract.clientId } },
        type: { connect: { id: dto.typeId } },
        bank: { connect: { id: dto.bankId } },
        method: { connect: { id: dto.methodId } },
        category: { connect: { id: dto.categoryId } },
      },
    });

    await this.recurringService.generateEager(recurring, userId, null);

    return this.prisma.companyContract.update({
      where: { id: contractId },
      data: { recurringId: recurring.id },
      include: contractIncludes,
    });
  }
}
