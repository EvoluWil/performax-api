import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
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

  @IsArray()
  @ArrayMinSize(1)
  @IsMongoId({ each: true })
  financeIds: string[];

  /** Effective cash received, in cents */
  @IsInt()
  @Min(1)
  receivedValue: number;

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
