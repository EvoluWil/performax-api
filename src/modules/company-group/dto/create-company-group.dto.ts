import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCompanyGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
