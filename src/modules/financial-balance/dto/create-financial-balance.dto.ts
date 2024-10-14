import { IsOptional, IsString } from 'class-validator';

export class CreateFinancialBalanceDto {
  @IsOptional()
  @IsString()
  value: string;
}
