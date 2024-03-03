import {
  IsBoolean,
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

  @IsBoolean()
  @IsOptional()
  allClients = false;

  @IsNotEmpty()
  @IsMongoId()
  typeId: string;

  @IsOptional()
  @IsMongoId()
  clientId: string;
}
