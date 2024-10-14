import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnsureAuthenticated implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: () => void) {
    const AuthHeader = req.headers.authorization;

    if (!AuthHeader) {
      return this.accessDenied(req.url, 'Token não enviado', res);
    }

    const parts = AuthHeader.split(' ');

    if (parts.length !== 2) {
      return this.accessDenied(req.url, 'Token invalido', res);
    }

    const [bearer, token] = parts;

    if (!/^Bearer$/.test(bearer)) {
      return this.accessDenied(req.url, 'Usuário não autorizado', res);
    }

    await this.jwtService
      .verifyAsync(token)
      .then(({ id, email }) => {
        req.user = { id, email };

        const user = this.prisma.user.findFirst({
          where: { id },
        });

        return user;
      })
      .then((user) => {
        if (!user) {
          return this.accessDenied(req.url, 'Usuário não autorizado', res);
        }

        if (!user.active) {
          return this.accessDenied(req.url, 'Usuário não autorizado', res);
        }

        return next();
      })
      .catch(() => {
        return this.accessDenied(req.url, 'Usuário não autorizado', res);
      });
  }

  private accessDenied(url: string, message: string, res: Response) {
    return res.status(401).json({
      statusCode: 401,
      path: url,
      message: message,
    });
  }
}
