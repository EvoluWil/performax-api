import { EmployeeDocumentTypeEnum } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateEmployeeDocumentDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsUrl()
  proof: string;

  @IsNotEmpty()
  @IsOptional()
  @IsEnum(EmployeeDocumentTypeEnum)
  type: EmployeeDocumentTypeEnum;
}
