import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEntryTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  needApprove: boolean;
}
