import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsCnpj } from 'src/decorators/cnpj.decorator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsCnpj(null, true)
  cnpj: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @IsBoolean()
  @IsNotEmpty()
  recurrent: boolean;
}
