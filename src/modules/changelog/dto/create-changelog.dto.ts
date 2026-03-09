import { ChangelogTypeEnum } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateChangelogDto {
  @IsString()
  @IsNotEmpty()
  version: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(ChangelogTypeEnum)
  @IsNotEmpty()
  type: ChangelogTypeEnum;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}
