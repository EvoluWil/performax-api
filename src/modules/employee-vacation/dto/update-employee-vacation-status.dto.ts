import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

enum VacationStatusEnum {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class UpdateEmployeeVacationStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(VacationStatusEnum)
  status: VacationStatusEnum;

  @IsString()
  @IsNotEmpty()
  obs: string;
}
