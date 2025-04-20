import { UserRoleEnum } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsCpf } from 'src/decorators/cpf.decorator';

export class CreateUserDto {
  @IsString()
  @IsCpf()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  isRgSeg: boolean;

  @IsOptional()
  @IsString()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum = UserRoleEnum.USER;
}
