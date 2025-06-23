import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsCpf } from 'src/decorators/cpf.decorator';

export class ProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsCpf()
  @IsNotEmpty()
  cpf: string;
}
