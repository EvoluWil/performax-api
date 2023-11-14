import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { IsCpf } from 'src/decorators/cpf.decorator';
import { IsMatch } from 'src/decorators/match.decorator';

export class SignUpDto {
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

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsMatch('password')
  passwordConfirmation: string;
}
