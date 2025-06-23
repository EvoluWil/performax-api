import { BadRequestException, Injectable } from '@nestjs/common';
import { Querybuilder } from 'nestjs-prisma-querybuilder';
import { PrismaService } from '../prisma.service';

@Injectable()
export class QBService {
  constructor(
    private readonly querybuilder: Querybuilder,
    private readonly prisma: PrismaService,
  ) {}

  async query(model: string) {
    return this.querybuilder
      .query()
      .then(async (query) => {
        const count = await this.prisma[model].count({ where: query.where });
        return { query, count };
      })
      .catch((err) => {
        if (err.response?.message)
          throw new BadRequestException(err.response?.message);

        throw new BadRequestException(
          'Internal error processing your query string, check your parameters',
        );
      });
  }
}
