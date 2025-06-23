import { IsNotEmpty, IsString } from 'class-validator';
import { IsMatch } from 'src/decorators/match.decorator';

export class CredentialDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsMatch('password')
  passwordConfirmation: string;
}
