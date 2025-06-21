import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { add } from 'date-fns';
import { EmailService } from 'src/providers/email/email.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { defaultPlainToClass } from 'src/utils/default-plain-class.utils';
import { generateHash } from 'src/utils/generate-hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateClientsDto } from './dto/update-clients.dto';
import { UpdateCoordinatesDto } from './dto/update-coordinates.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto, companyId: string) {
    const { cpf, email } = createUserDto;

    const user = await this.prisma.user.findFirst({
      where: { OR: [{ cpf }, { email }] },
    });

    if (user) {
      throw new BadRequestException('CPF e/ou e-mail já cadastrado!');
    }

    const hash = generateHash();

    await this.emailService.welcomeEmail({
      email,
      name: createUserDto.name,
      hash,
    });

    const resetTokenExpiry = add(new Date(), { days: 15 });

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        resetToken: hash,
        resetTokenExpiry,
        companies: { connect: { id: companyId } },
      },
    });

    return defaultPlainToClass(FindUserDto, newUser);
  }

  async findAll(companyId: string) {
    const query = await this.qb.query('user');
    const users = await this.prisma.user.findMany({
      ...query,
      where: { ...query.where, companies: { some: { id: companyId } } },
    });
    return defaultPlainToClass(FindUserDto, users);
  }

  async findOne(id: string) {
    const query = await this.qb.query('user');
    const user = await this.prisma.user.findFirst({
      ...query,
      where: { id },
    });

    if (!user) {
      throw new BadRequestException(`Usuário não encontrado!`);
    }

    return defaultPlainToClass(FindUserDto, user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { email, name, cpf, ...rest } = updateUserDto;
    const user = await this.prisma.user.findUnique({ where: { id: id } });

    if (!user) {
      throw new BadRequestException(`Usuário não encontrado!`);
    }

    if (email && email !== user.email) {
      const userEmailExists = await this.prisma.user.findFirst({
        where: { email },
      });

      if (userEmailExists) {
        throw new BadRequestException(`E-mail já esta em uso!`);
      }

      if (!user?.password) {
        const hash = generateHash();

        await this.emailService.welcomeEmail({
          email,
          name,
          hash,
        });

        const resetTokenExpiry = add(new Date(), { days: 15 });

        return this.prisma.user.update({
          where: { id },
          data: {
            ...rest,
            name,
            email,
            resetToken: hash,
            resetTokenExpiry,
          },
        });
      }
    }

    if (cpf && cpf !== user.cpf) {
      const userCpfExists = await this.prisma.user.findFirst({
        where: { cpf },
      });

      if (userCpfExists) {
        throw new BadRequestException(`CPF já esta em uso!`);
      }
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        name,
        email,
        cpf,
      },
    });

    return { ok: true };
  }

  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
    companyId: string,
  ) {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new BadRequestException(`Usuário não encontrado!`);
    }

    if (this.checkSameRole(user, companyId, updateRoleDto.role)) {
      throw new BadRequestException(`Usuário já possui esse cargo!`);
    }

    if (
      user?.coordinatorCompaniesId?.includes(companyId) &&
      updateRoleDto.role !== 'COORDINATOR'
    ) {
      if (user.coordinatesId?.length) {
        await Promise.all(
          user.coordinatesId.map((coordinateId) =>
            this.prisma.user.update({
              where: { id },
              data: { coordinates: { disconnect: { id: coordinateId } } },
            }),
          ),
        );
      }
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        ...this.getCurrentRoleToRemove(user, companyId),
        ...this.getRoleData(updateRoleDto.role, companyId),
      },
    });

    return { ok: true };
  }

  async updateCoordinates(
    id: string,
    updateCoordinatesDto: UpdateCoordinatesDto,
    companyId: string,
  ) {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new BadRequestException(`Usuário não encontrado!`);
    }

    if (!user.coordinatorCompaniesId?.includes(companyId)) {
      throw new BadRequestException(`Usuário não é um coordenador!`);
    }

    if (user.coordinatesId?.length) {
      await Promise.all(
        user.coordinatesId.map((coordinateId) =>
          this.prisma.user.update({
            where: { id },
            data: { coordinates: { disconnect: { id: coordinateId } } },
          }),
        ),
      );
    }

    await Promise.all(
      updateCoordinatesDto?.coordinates.map((coordinateId) =>
        this.prisma.user.update({
          where: { id },
          data: { coordinates: { connect: { id: coordinateId } } },
        }),
      ),
    );

    return { ok: true };
  }

  async updateClients(
    id: string,
    { clients }: UpdateClientsDto,
    companyId: string,
  ) {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new BadRequestException(`Usuário não encontrado!`);
    }

    if (user.gestorCompaniesId?.includes(companyId)) {
      throw new BadRequestException(`Usuário não é um gestor!`);
    }

    if (user.clientsIds?.length) {
      await this.prisma.user.update({
        where: { id },
        data: {
          clients: {
            disconnect: user.clientsIds.map((client) => ({ id: client })),
          },
        },
      });
    }

    await this.prisma.user.update({
      where: { id },
      data: { clients: { connect: clients.map((client) => ({ id: client })) } },
    });

    return { ok: true };
  }

  async remove(id: string, companyId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException(`Usuário não encontrado!`);
    }

    if (user?.adminCompaniesId?.includes(companyId)) {
      await this.prisma.user.update({
        where: { id },
        data: {
          adminCompanies: {
            disconnect: { id: companyId },
          },
          companies: {
            disconnect: { id: companyId },
          },
        },
      });
    }

    if (user?.coordinatorCompaniesId?.includes(companyId)) {
      await this.prisma.user.update({
        where: { id },
        data: {
          coordinatorCompanies: {
            disconnect: { id: companyId },
          },
          companies: {
            disconnect: { id: companyId },
          },
        },
      });
    }

    if (user?.attendantCompaniesId?.includes(companyId)) {
      await this.prisma.user.update({
        where: { id },
        data: {
          attendantCompanies: {
            disconnect: { id: companyId },
          },
          companies: {
            disconnect: { id: companyId },
          },
        },
      });
    }

    if (user?.financialCompaniesId?.includes(companyId)) {
      await this.prisma.user.update({
        where: { id },
        data: {
          financialCompanies: {
            disconnect: { id: companyId },
          },
          companies: {
            disconnect: { id: companyId },
          },
        },
      });
    }

    if (user?.gestorCompaniesId?.includes(companyId)) {
      await this.prisma.user.update({
        where: { id },
        data: {
          gestorCompanies: {
            disconnect: { id: companyId },
          },
          companies: {
            disconnect: { id: companyId },
          },
        },
      });
    }

    return { ok: true };
  }

  getCurrentRoleToRemove(user: User, companyId: string) {
    if (user.adminCompaniesId?.includes(companyId)) {
      return {
        adminCompanies: {
          disconnect: {
            id: companyId,
          },
        },
      };
    }

    if (user.coordinatorCompaniesId?.includes(companyId)) {
      return {
        coordinatorCompaniesId: {
          disconnect: {
            id: companyId,
          },
        },
      };
    }

    if (user.attendantCompaniesId?.includes(companyId)) {
      return {
        attendantCompaniesId: {
          disconnect: {
            id: companyId,
          },
        },
      };
    }

    if (user.financialCompaniesId?.includes(companyId)) {
      return {
        financialCompaniesId: {
          disconnect: {
            id: companyId,
          },
        },
      };
    }

    if (user.gestorCompaniesId?.includes(companyId)) {
      return {
        clients: {
          disconnect: {
            id: companyId,
          },
        },
      };
    }
  }

  getRoleData(role: string, companyId: string) {
    const roleData = {
      ADMIN: {
        adminCompanies: {
          connect: {
            id: companyId,
          },
        },
      },
      COORDINATOR: {
        coordinatorCompaniesId: {
          connect: {
            id: companyId,
          },
        },
      },
      ATTENDANT: {
        attendantCompaniesId: {
          connect: {
            id: companyId,
          },
        },
      },
      FINANCIAL: {
        financialCompaniesId: {
          connect: {
            id: companyId,
          },
        },
      },
      GESTOR: {
        clients: {
          connect: {
            id: companyId,
          },
        },
      },
    };

    return roleData[role];
  }

  checkSameRole(user: User, companyId: string, role: string): boolean {
    if (user.adminCompaniesId?.includes(companyId) && role === 'ADMIN') {
      return true;
    }

    if (
      user.coordinatorCompaniesId?.includes(companyId) &&
      role === 'COORDINATOR'
    ) {
      return true;
    }

    if (
      user.attendantCompaniesId?.includes(companyId) &&
      role === 'ATTENDANT'
    ) {
      return true;
    }

    if (
      user.financialCompaniesId?.includes(companyId) &&
      role === 'FINANCIAL'
    ) {
      return true;
    }

    if (user.gestorCompaniesId?.includes(companyId) && role === 'GESTOR') {
      return true;
    }

    return false;
  }
}
