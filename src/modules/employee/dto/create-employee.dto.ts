import { ContractTypeEnum } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { IsCpf } from 'src/decorators/cpf.decorator';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  salary: string;

  @IsNotEmpty()
  @IsDateString()
  admission: Date;

  @IsNotEmpty()
  @IsEnum(ContractTypeEnum)
  contractType: ContractTypeEnum;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  roleId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsCpf()
  cpf: string;
}
