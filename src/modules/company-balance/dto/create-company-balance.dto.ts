import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyBalanceDto {
  @IsString()
  @IsNotEmpty()
  initialValue: string;
}
