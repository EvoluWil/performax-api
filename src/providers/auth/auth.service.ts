import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { add } from 'date-fns';
import { FindUserDto } from 'src/modules/user/dto/find-user.dto';
import { defaultPlainToClass } from 'src/utils/default-plain-class.utils';
import { generateHash } from 'src/utils/generate-hash.util';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
  private generateToken(id: string, email: string) {
    const payload = { id, email };

    const token = this.jwtService.sign(payload);

    return token;
  }

  async auth(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.prisma.user.findFirst({
      where: { email: email },
      include: {
        companies: {
          select: {
            name: true,
            id: true,
          },
        },
        employees: {
          select: {
            id: true,
            accessLevel: true,
            role: {
              select: {
                name: true,
                sector: {
                  select: {
                    company: {
                      select: {
                        name: true,
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Email ou senha incorretos');
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      throw new BadRequestException('Email ou senha incorretos');
    }

    const token = this.generateToken(user.id, user.email);

    return { user: defaultPlainToClass(FindUserDto, user), token };
  }

  async signUp(signUpDto: SignUpDto) {
    const { cpf, email } = signUpDto;

    const user = await this.prisma.user.findFirst({
      where: { OR: [{ cpf }, { email }] },
    });

    if (user) {
      throw new BadRequestException('CPF e/ou e-mail já cadastrado!');
    }

    const password = await bcrypt.hash(signUpDto.password, 10);

    delete signUpDto.passwordConfirmation;

    const newUser = await this.prisma.user.create({
      data: { ...signUpDto, password },
    });

    return defaultPlainToClass(FindUserDto, newUser);
  }

  async getMe({ id }: AuthUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: {
        companies: {
          select: {
            name: true,
            id: true,
          },
        },
        employees: {
          select: {
            id: true,
            role: {
              select: {
                name: true,
                sector: {
                  select: {
                    company: {
                      select: {
                        name: true,
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return defaultPlainToClass(FindUserDto, user);
  }

  async updatePassword({ id }: AuthUserDto, { password }: UpdatePasswordDto) {
    const newPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.update({
      where: { id },
      data: { password: newPassword },
    });

    return defaultPlainToClass(FindUserDto, user);
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return { ok: true };
    }

    const hash = generateHash();

    await this.emailService.forgotPasswordEmail({
      email,
      name: user.name,
      hash,
    });

    const resetTokenExpiry = add(new Date(), { hours: 1 });

    await this.prisma.user.update({
      where: { email },
      data: { resetToken: hash, resetTokenExpiry },
    });

    return { ok: true };
  }

  async validateToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });

    if (!user) {
      throw new BadRequestException('Token inválido');
    }

    return { ok: true };
  }

  async recoveryPassword(token: string, { password }: UpdatePasswordDto) {
    const newPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.findFirst({
      where: {
        AND: [{ resetToken: token }, { resetTokenExpiry: { gt: new Date() } }],
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido');
    }

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: { password: newPassword, resetToken: null },
    });

    return { ok: true };
  }
}
