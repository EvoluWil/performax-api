import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEntryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsOptional()
  @IsNumber()
  value: number;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  typeId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  responsibleId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  clientId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  employeeId: string;
}
