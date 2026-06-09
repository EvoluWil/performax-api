import {
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAdvanceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  observation?: string;

  /** Value in cents */
  @IsInt()
  @IsNotEmpty()
  totalValue: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsMongoId()
  bankId: string;

  @IsMongoId()
  methodId: string;

  @IsMongoId()
  @IsOptional()
  typeId?: string;
}
