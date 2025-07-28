import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { generateProtocol } from 'src/utils/generate-protocol';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UtilService {
  constructor(private readonly prisma: PrismaService) {}

  async generateUniqueProtocol<T extends keyof PrismaClient>(
    model: T,
  ): Promise<string> {
    let protocol: string;
    let index = 0;

    while (true) {
      protocol = `${generateProtocol()}${index > 0 ? `-${index}` : ''}`;

      const existing = await (this.prisma[model] as any).findUnique({
        where: { protocol },
      });

      if (!existing) {
        break;
      }

      index++;
    }

    return protocol;
  }
}
