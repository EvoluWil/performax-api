import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  cpf: string;

  @IsString()
  @IsOptional()
  place: string;
}
