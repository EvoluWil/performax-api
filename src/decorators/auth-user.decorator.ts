import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FindUserDto } from 'src/modules/company/user/dto/find-user.dto';

export const AuthUser = createParamDecorator(
  (_data, ctx: ExecutionContext): FindUserDto => {
    const request = ctx.switchToHttp().getRequest();

    return plainToClass(FindUserDto, request.user);
  },
);
