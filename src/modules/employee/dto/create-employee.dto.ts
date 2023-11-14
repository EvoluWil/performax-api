import { ContractTypeEnum } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsNumber()
  @IsNotEmpty()
  salary: number;

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
  @IsMongoId()
  userId: string;
}
