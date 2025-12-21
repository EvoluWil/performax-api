import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  needApprove: boolean;
}
