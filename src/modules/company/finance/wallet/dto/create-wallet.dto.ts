import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
