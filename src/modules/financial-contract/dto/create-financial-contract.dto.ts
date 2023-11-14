import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFinancialContractDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
