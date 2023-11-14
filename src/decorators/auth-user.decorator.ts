import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthUserDto } from 'src/providers/auth/dto/auth-user.dto';

export const AuthUser = createParamDecorator(
  (_data, ctx: ExecutionContext): AuthUserDto => {
    const request = ctx.switchToHttp().getRequest();

    return plainToClass(AuthUserDto, request.user);
  },
);
