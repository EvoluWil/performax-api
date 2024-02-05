import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDayDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  inClockId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  outClockId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  inLunchClockId: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  outLunchClockId: string;
}
