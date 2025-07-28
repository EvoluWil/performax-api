import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  cpf: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  clientId: string;
}
