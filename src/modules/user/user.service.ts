import { BadRequestException, Injectable } from '@nestjs/common';
import { add } from 'date-fns';
import { EmailService } from 'src/providers/email/email.service';
import { QBService } from 'src/providers/prisma/prisma-querybuilder/prisma-querybuilder.service';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { defaultPlainToClass } from 'src/utils/default-plain-class.utils';
import { generateHash } from 'src/utils/generate-hash.util';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly qb: QBService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
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
      data: { ...createUserDto, resetToken: hash, resetTokenExpiry },
    });

    return defaultPlainToClass(FindUserDto, newUser);
  }

  async findAll() {
    const query = await this.qb.query('user');
    const users = await this.prisma.user.findMany(query);
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
    const { email, name } = updateUserDto;
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
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
    });

    return { ok: true };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new BadRequestException(`Usuário não encontrado!`);
    }

    await this.prisma.user.delete({ where: { id } });

    return { ok: true };
  }
}
