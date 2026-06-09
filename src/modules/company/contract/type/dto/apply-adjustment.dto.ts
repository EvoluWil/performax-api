import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class ApplyAdjustmentDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(-100)
  @Max(1000)
  percentage: number;
}
