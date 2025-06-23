import { IsNotEmpty, IsString } from 'class-validator';
import { IsMatch } from 'src/decorators/match.decorator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsMatch('password')
  passwordConfirmation: string;
}
