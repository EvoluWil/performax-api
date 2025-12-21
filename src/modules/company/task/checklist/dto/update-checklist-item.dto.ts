import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChecklistItemDto {
  @IsString()
  @IsOptional()
  valueText?: string;

  @IsNumber()
  @IsOptional()
  valueNumber?: number;

  @IsBoolean()
  @IsOptional()
  valueBoolean?: boolean;
}
