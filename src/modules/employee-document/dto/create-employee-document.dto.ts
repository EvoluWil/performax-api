import { EmployeeDocumentTypeEnum } from '@prisma/client';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateEmployeeDocumentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  proof: string;

  @IsNotEmpty()
  @IsEnum(EmployeeDocumentTypeEnum)
  type: EmployeeDocumentTypeEnum;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  employeeId: string;
}
