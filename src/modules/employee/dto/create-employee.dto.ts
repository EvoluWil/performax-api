import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsCpf } from 'src/decorators/cpf.decorator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsCpf()
  cpf: string;
}
