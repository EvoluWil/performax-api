import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateProfileContactDto } from './dto/create-profile-contact.dto';
import { UpdateProfileContactDto } from './dto/update-profile-contact.dto';

@Injectable()
export class ProfileContactService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    authUserId: string,
    createProfileContactDto: CreateProfileContactDto,
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

    return this.prisma.profileContact.create({
      data: {
        ...createProfileContactDto,
        profile: { connect: { id: user.profileId } },
      },
    });
  }

  async update(id: string, updateProfileContactDto: UpdateProfileContactDto) {
    const profileContact = await this.prisma.profileContact.findFirst({
      where: { id },
    });

    if (!profileContact) {
      throw new BadRequestException('Contato não encontrado');
    }

    return this.prisma.profileContact.update({
      where: { id },
      data: updateProfileContactDto,
    });
  }

  async remove(id: string) {
    const profileContact = await this.prisma.profileContact.findFirst({
      where: { id },
    });

    if (!profileContact) {
      throw new BadRequestException('Contato não encontrado');
    }

    return this.prisma.profileContact.delete({ where: { id } });
  }
}
