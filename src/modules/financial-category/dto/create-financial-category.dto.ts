import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFinancialCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
