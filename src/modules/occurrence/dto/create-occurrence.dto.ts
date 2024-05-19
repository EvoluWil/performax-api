import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateOccurrenceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsArray()
  documents: string[];

  @IsMongoId()
  @IsNotEmpty()
  clientId: string;
}
