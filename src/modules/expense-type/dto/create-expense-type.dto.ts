import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExpenseTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  needApprove: boolean;
}
