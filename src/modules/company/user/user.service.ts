import {
  ConflictException,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { MailTypeEnum } from 'src/providers/mail/dto/send-mail.dto';
import { MailService } from 'src/providers/mail/mail.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { defaultPlainToClass } from 'src/utils/default-plain-class.utils';
import { generateCode } from 'src/utils/generate-code.util';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
    private readonly mailService: MailService,
    private readonly logger: LoggerService,
  ) {}

  async create(createUserDto: CreateUserDto, companyId: string) {
    const { cpf, email } = createUserDto;

    const cpfAlreadyExists = await this.prisma.user.findFirst({
      where: { cpf },
      include: {
        companyUser: {
          select: {
            companyId: true,
          },
        },
      },
    });

    const emailAlreadyExists = await this.prisma.user.findFirst({
      where: { email },
      include: {
        companyUser: {
          select: {
            companyId: true,
          },
        },
      },
    });

    if (
      cpfAlreadyExists &&
      emailAlreadyExists &&
      cpfAlreadyExists.id !== emailAlreadyExists.id
    ) {
      throw new ConflictException(
        'CPF e e-mail já estão sendo utilizados por usuários diferentes!',
      );
    }

    const user = cpfAlreadyExists || emailAlreadyExists;

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException(`Empresa não encontrada!`);
    }

    if (user) {
      if (
        user.companyUser?.some((company) => company.companyId === companyId)
      ) {
        throw new ConflictException(`Usuário já cadastrado nesta empresa!`);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          companyUser: {
            create: {
              company: {
                connect: { id: companyId },
              },
            },
          },
        },
      });

      try {
        const emailData = {
          username: updatedUser.name?.split(' ')[0],
          company: company.name,
        };

        await this.mailService.sendMail({
          to: updatedUser.email,
          subject: `Convite ${company.name} - Performax`,
          type: MailTypeEnum.WELCOME_NEW_COMPANY,
          ...emailData,
        });

        return defaultPlainToClass(FindUserDto, updatedUser);
      } catch {
        this.logger.error('Erro ao enviar email de convite', {
          userId: updatedUser.id,
          companyId,
        });
      }
    }

    const code = generateCode();

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        companyUser: { create: { company: { connect: { id: companyId } } } },
        recoveryPassword: {
          create: {
            code,
          },
        },
      },
    });

    const emailData = {
      username: newUser.name?.split(' ')[0],
      code,
      email: newUser.email,
      company: company.name,
    };

    try {
      await this.mailService.sendMail({
        to: newUser.email,
        subject: `Cadastro ${company.name} - Performax`,
        type: MailTypeEnum.NEW_ACCOUNT,
        ...emailData,
      });
    } catch {
      this.logger.error('Erro ao enviar email de cadastro', {
        userId: newUser.id,
        companyId,
      });
    }

    return defaultPlainToClass(FindUserDto, newUser);
  }

  async findAll(companyId: string) {
    const { count, query } = await this.qb.query('user');
    const users = await this.prisma.user.findMany({
      ...query,
      where: { ...query.where, companyUser: { some: { companyId } } },
    });
    return { users: defaultPlainToClass(FindUserDto, users), count };
  }

  async findOne(userId: string, companyId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyUser: { some: { companyId } } },
    });

    if (!user) {
      throw new NotFoundException(`Usuário não encontrado!`);
    }

    return defaultPlainToClass(FindUserDto, user);
  }

  async remove(userId: string, companyId: string) {
    await this.findOne(userId, companyId);

    return this.prisma.companyUserRole.delete({
      where: { userId_companyId: { userId, companyId } },
    });
  }
}
