import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmployeeBenefitDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  benefitId: string;
}
