import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma/prisma.service';
import { CreateProfileAddressDto } from './dto/create-profile-address.dto';
import { UpdateProfileAddressDto } from './dto/update-profile-address.dto';

@Injectable()
export class ProfileAddressService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    authUserId: string,
    createProfileAddressDto: CreateProfileAddressDto,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: authUserId },
      select: { profile: { select: { address: true, id: true } } },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (!user.profile.id) {
      throw new BadRequestException('Perfil não encontrado');
    }

    if (user.profile.address.length) {
      const profileAddressId = user.profile.address[0].id;
      return this.prisma.profileAddress.update({
        where: { id: profileAddressId },
        data: createProfileAddressDto,
      });
    }

    return this.prisma.profileAddress.create({
      data: {
        ...createProfileAddressDto,
        profile: { connect: { id: user.profile.id } },
      },
    });
  }

  async update(id: string, updateProfileAddressDto: UpdateProfileAddressDto) {
    const profileAddress = await this.prisma.profileAddress.findFirst({
      where: { id },
    });

    if (!profileAddress) {
      throw new BadRequestException('Endereço não encontrado');
    }

    return this.prisma.profileAddress.update({
      where: { id },
      data: updateProfileAddressDto,
    });
  }
}
