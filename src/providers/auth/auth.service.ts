import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRoleEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { addDays, differenceInMilliseconds, isPast } from 'date-fns';
import { FindUserDto } from 'src/modules/company/user/index/dto/find-user.dto';
import { defaultPlainToClass } from 'src/utils/default-plain-class.utils';
import { generateCode } from 'src/utils/generate-code.util';
import { generateHash } from 'src/utils/generate-hash.util';
import { MailTypeEnum } from '../mail/dto/send-mail.dto';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialDto } from './dto/credentials.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

const SIXTY_MINUTES = 60 * 60 * 1000; // 60 minutes in milliseconds
const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}
  private generateAccessToken(id: string) {
    const payload = { id };
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async createSession(userId: string) {
    const accessToken = this.generateAccessToken(userId);
    const refreshToken = randomBytes(64).toString('hex');
    const accessTokenExpires = Date.now() + SIXTY_MINUTES;

    await this.prisma.userSession.deleteMany({
      where: { userId },
    });

    await this.prisma.userSession.create({
      data: {
        accessToken,
        refreshToken,
        userId,
      },
    });
    return { accessToken, refreshToken, accessTokenExpires };
  }

  private async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<FindUserDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
      include: { credential: true },
    });

    if (!user) {
      throw new BadRequestException('Email ou senha incorretos');
    }

    const passwordMatched = await bcrypt.compare(
      password,
      user?.credential?.password,
    );

    if (!passwordMatched) {
      throw new BadRequestException('Email ou senha incorretos');
    }

    return defaultPlainToClass(FindUserDto, user);
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.validateUserCredentials(
      signInDto.email,
      signInDto.password,
    );
    console.log(user);
    const session = await this.createSession(user.id);
    console.log(session);
    return { user, session };
  }

  async signUp(signUpDto: SignUpDto) {
    const {
      profile,
      credentials: { password },
    } = signUpDto;
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ cpf: profile.cpf }, { email: profile.email }],
      },
    });

    if (user) {
      throw new BadRequestException('E-mail ou CPF já cadastrado');
    }

    const hash = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        ...profile,
        credential: { create: { password: hash } },
        companies: {
          create: {
            name: signUpDto.company.name,
          },
        },
      },
    });

    const emailData = {
      username: profile.name?.split(' ')[0],
    };

    try {
      await this.mailService.sendMail({
        to: profile.email,
        subject: 'Boas vindas ao Performax!',
        type: MailTypeEnum.WELCOME,
        ...emailData,
      });
    } catch (err) {
      console.warn(`Erro ao enviar email: ${err?.message}`);
    }

    return { ok: true };
  }

  async getMe({ id }: User) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        companies: {
          include: {
            whiteLabel: true,
          },
        },
        companyUser: {
          include: {
            company: {
              include: {
                whiteLabel: true,
              },
            },
            role: {
              include: {
                permissions: {
                  include: {
                    module: true,
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

    if (user.role === UserRoleEnum.SYSTEM_ADMIN) {
      const companies = await this.prisma.company.findMany({
        include: { whiteLabel: true },
      });
      user.companies = companies;
    }

    return defaultPlainToClass(FindUserDto, user);
  }

  async updatePassword(
    { id }: User,
    { password, currentPassword }: UpdatePasswordDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { credential: true },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const passwordMatched = await bcrypt.compare(
      currentPassword,
      user?.credential?.password,
    );

    if (!passwordMatched) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const newPassword = await bcrypt.hash(password, 10);

    await this.prisma.userCredential.update({
      where: { id: user.credential?.id },
      data: { password: newPassword },
    });

    return { ok: true };
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const code = generateCode();

    const emailData = {
      username: user.name?.split(' ')[0],
      code,
      email: user.email,
    };

    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Recuperação de senha - Performax',
        type: MailTypeEnum.FORGOT_PASSWORD,
        ...emailData,
      });
    } catch {
      throw new BadRequestException(
        'Erro ao enviar email de recuperação de senha',
      );
    }

    await this.prisma.userRecoveryPassword.deleteMany({
      where: { userId: user.id },
    });

    await this.prisma.userRecoveryPassword.create({
      data: {
        code,
        user: { connect: { id: user.id } },
      },
    });

    return { ok: true };
  }

  async validateCode(code: string, { email }: ForgotPasswordDto) {
    const recovery = await this.prisma.userRecoveryPassword.findFirst({
      where: { code, user: { email } },
      include: { user: { include: { credential: true } } },
    });

    if (!recovery) {
      throw new BadRequestException('Código inválido');
    }

    const hasCredential = !!recovery.user?.credential;

    const tokenExpireIn = hasCredential ? SIXTY_MINUTES : FIFTEEN_DAYS;

    if (
      differenceInMilliseconds(new Date(recovery?.createdAt), new Date()) >
      tokenExpireIn
    ) {
      await this.prisma.userRecoveryPassword.delete({
        where: { id: recovery.id },
      });

      throw new BadRequestException('Código expirado');
    }

    const hash = generateHash();

    await this.prisma.userRecoveryPassword.update({
      where: { id: recovery.id },
      data: { resetToken: hash, code: null },
    });

    return { token: hash };
  }

  async recoveryPassword(token: string, { password }: CredentialDto) {
    const recovery = await this.prisma.userRecoveryPassword.findFirst({
      where: {
        resetToken: token,
      },
      include: { user: { select: { id: true, credential: true } } },
    });

    if (!recovery) {
      throw new BadRequestException('Token inválido');
    }

    if (
      differenceInMilliseconds(new Date(recovery?.createdAt), new Date()) >
      SIXTY_MINUTES
    ) {
      throw new BadRequestException('Token expirado');
    }

    const newPassword = await bcrypt.hash(password, 10);

    if (recovery.user?.credential?.id) {
      await this.prisma.userCredential.update({
        where: { id: recovery.user.credential.id },
        data: { password: newPassword },
      });
    } else if (recovery.user?.id) {
      await this.prisma.user.update({
        where: { id: recovery.user.id },
        data: { credential: { create: { password: newPassword } } },
      });
    }

    await this.prisma.userRecoveryPassword.delete({
      where: { id: recovery.id },
    });

    return { ok: true };
  }

  async deleteAccount(signInDto: SignInDto) {
    const user = await this.validateUserCredentials(
      signInDto.email,
      signInDto.password,
    );

    if (user) {
      await this.prisma.user.delete({
        where: { id: user.id },
      });
      return { ok: true };
    }
    throw new BadRequestException('Usuário não encontrado');
  }

  async refreshAccessToken(refreshToken: string) {
    const session = await this.prisma.userSession.findFirst({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || isPast(new Date(addDays(session.createdAt, 2)))) {
      throw new BadRequestException('Refresh token inválido ou expirado');
    }

    const newSession = await this.createSession(session.userId);

    return {
      session: newSession,
      user: defaultPlainToClass(FindUserDto, session.user),
    };
  }

  async signOut(userId: string) {
    const session = await this.prisma.userSession.findUnique({
      where: { userId },
    });

    if (!session) {
      throw new BadRequestException('Sessão não encontrada');
    }

    await this.prisma.userSession.delete({ where: { id: session.id } });
    return { ok: true };
  }
}
