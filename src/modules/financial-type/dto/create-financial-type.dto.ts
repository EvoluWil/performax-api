import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFinancialTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  needApprove: boolean;
}
