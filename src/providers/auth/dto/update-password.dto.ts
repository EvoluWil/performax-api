import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { IsMatch } from 'src/decorators/match.decorator';

export class UpdatePasswordDto {
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
