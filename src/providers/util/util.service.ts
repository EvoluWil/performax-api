import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { generateProtocol } from 'src/utils/generate-protocol';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UtilService {
  private readonly logger = new Logger(UtilService.name);

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

  /**
   * Cria um registro garantindo unicidade do `protocol` mesmo sob
   * concorrência ou em loops apertados dentro do mesmo minuto.
   *
   * Estratégia: gera um protocolo via `generateUniqueProtocol` e tenta
   * criar. Se cair em P2002 (unique violation), regera com sufixo
   * aleatório e tenta de novo, até `maxRetries`. Isso evita a janela de
   * TOCTOU entre `findUnique` e `create`.
   */
  async createWithUniqueProtocol<T extends keyof PrismaClient, R = unknown>(
    model: T,
    data: Record<string, unknown>,
    options: { maxRetries?: number; protocolKey?: string } = {},
  ): Promise<R> {
    const maxRetries = options.maxRetries ?? 5;
    const protocolKey = options.protocolKey ?? 'protocol';

    let lastError: unknown;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const baseProtocol = await this.generateUniqueProtocol(model);
      const protocol =
        attempt === 0
          ? baseProtocol
          : `${baseProtocol}-${Math.random().toString(36).slice(2, 6)}`;

      try {
        return (await (this.prisma[model] as any).create({
          data: { ...data, [protocolKey]: protocol },
        })) as R;
      } catch (e: any) {
        const isUniqueViolation =
          e?.code === 'P2002' ||
          (typeof e?.message === 'string' &&
            e.message.includes('Unique constraint failed'));
        if (isUniqueViolation && attempt < maxRetries - 1) {
          this.logger.warn(
            `Protocol collision on ${String(model)} (attempt ${
              attempt + 1
            }/${maxRetries}), retrying with randomized suffix`,
          );
          lastError = e;
          continue;
        }
        throw e;
      }
    }

    throw (
      lastError ??
      new Error(
        `Failed to create ${String(model)} with unique protocol after ${maxRetries} retries`,
      )
    );
  }
}
