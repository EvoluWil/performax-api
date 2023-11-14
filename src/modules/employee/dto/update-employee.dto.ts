import { ContractTypeEnum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEmployeeDto {
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  salary: number;

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
