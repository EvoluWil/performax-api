import { UserRoleEnum } from '@prisma/client';
import {
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

  @IsOptional()
  @IsString()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum = UserRoleEnum.USER;
}
