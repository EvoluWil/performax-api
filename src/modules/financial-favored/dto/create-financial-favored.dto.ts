import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFinancialFavoredDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
