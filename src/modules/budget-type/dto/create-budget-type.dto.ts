import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBudgetTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
