import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
}
