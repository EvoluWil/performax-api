import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateProfileEducationDto } from './dto/create-profile-education.dto';
import { UpdateProfileEducationDto } from './dto/update-profile-education.dto';

@Injectable()
export class ProfileEducationService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    authUserId: string,
    createProfileEducationDto: CreateProfileEducationDto,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: authUserId },
      select: { profileId: true },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (!user.profileId) {
      throw new BadRequestException('Perfil não encontrado');
    }

    return this.prisma.profileEducation.create({
      data: {
        ...createProfileEducationDto,
        profile: { connect: { id: user.profileId } },
      },
    });
  }

  async update(
    id: string,
    updateProfileEducationDto: UpdateProfileEducationDto,
  ) {
    const profileEducation = await this.prisma.profileEducation.findFirst({
      where: { id },
    });

    if (!profileEducation) {
      throw new BadRequestException('Formação não encontrada');
    }

    return this.prisma.profileEducation.update({
      where: { id },
      data: updateProfileEducationDto,
    });
  }

  async remove(id: string) {
    const profileEducation = await this.prisma.profileEducation.findFirst({
      where: { id },
    });

    if (!profileEducation) {
      throw new BadRequestException('Formação não encontrada');
    }

    return this.prisma.profileEducation.delete({ where: { id } });
  }
}
