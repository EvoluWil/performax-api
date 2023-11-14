import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}
  async create(id: string, createProfileDto: CreateProfileDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
      include: { profile: true },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.profile) {
      return this.prisma.profile.update({
        where: { id: user.profile.id },
        data: createProfileDto,
      });
    }

    return this.prisma.profile.create({
      data: { ...createProfileDto, user: { connect: { id } } },
    });
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findFirst({
      where: { id },
    });

    if (!profile) {
      throw new BadRequestException('Perfil não encontrado');
    }

    return this.prisma.profile.update({
      where: { id },
      data: updateProfileDto,
    });
  }
}
