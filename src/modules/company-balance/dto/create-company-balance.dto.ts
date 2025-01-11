import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyBalanceDto {
  @IsString()
  @IsNotEmpty()
  initialValue: string;

  @IsMongoId()
  @IsNotEmpty()
  companyId: string;
}
