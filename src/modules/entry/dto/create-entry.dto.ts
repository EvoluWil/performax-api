import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
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
  @IsNotEmpty()
  value: string;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsOptional()
  observation: string;

  @IsNotEmpty()
  @IsMongoId()
  typeId: string;

  @IsMongoId()
  @IsNotEmpty()
  clientId: string;

  @IsOptional()
  @IsString()
  responsibleId: string;

  @IsOptional()
  @IsString()
  employeeId: string;
}
