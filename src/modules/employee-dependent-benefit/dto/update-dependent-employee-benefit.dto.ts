import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmployeeDependentBenefitDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  benefitId: string;
}
