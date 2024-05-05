import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEntryDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  value: string;

  @IsBoolean()
  @IsOptional()
  confirmed: boolean;

  @IsDateString()
  @IsOptional()
  visitedAt: Date;

  @IsOptional()
  @IsMongoId()
  typeId: string;

  @IsOptional()
  @IsMongoId()
  clientId: string;

  @IsBoolean()
  @IsOptional()
  allClients = false;

  @IsString()
  @IsOptional()
  observation: string;

  @IsString()
  @IsDateString()
  @IsOptional()
  date: Date;
}
