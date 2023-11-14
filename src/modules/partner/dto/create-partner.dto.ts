import { PartnerTypeEnum } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  document: string;

  @IsEnum(PartnerTypeEnum)
  type: PartnerTypeEnum;
}
