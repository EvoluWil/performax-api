import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsCnpj } from 'src/decorators/cnpj.decorator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsCnpj()
  cnpj: string;

  @IsString()
  @IsOptional()
  address: string;
}
