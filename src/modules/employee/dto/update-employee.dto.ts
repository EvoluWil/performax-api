import { ContractTypeEnum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  salary: string;

  @IsNotEmpty()
  @IsOptional()
  @IsDateString()
  admission: Date;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(ContractTypeEnum)
  contractType: ContractTypeEnum;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  roleId: string;
}
