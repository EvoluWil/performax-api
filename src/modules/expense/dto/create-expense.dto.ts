import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
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
  @IsNotEmpty()
  observation: string;

  @IsNotEmpty()
  @IsMongoId()
  typeId: string;

  @IsMongoId()
  @IsNotEmpty()
  clientId: string;
}
