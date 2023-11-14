import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsCpf } from 'src/decorators/cpf.decorator';

export class CreateUserDto {
  @IsString()
  @IsCpf()
  @IsNotEmpty()
  cpf: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
