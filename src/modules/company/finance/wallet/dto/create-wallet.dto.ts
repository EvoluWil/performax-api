import { IsNumber, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @IsOptional()
  initialValue?: number;
}
