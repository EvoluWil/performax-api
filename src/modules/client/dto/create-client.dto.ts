import { IsNotEmpty, IsString } from 'class-validator';
import { IsCnpj } from 'src/decorators/cnpj.decorator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsCnpj()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
