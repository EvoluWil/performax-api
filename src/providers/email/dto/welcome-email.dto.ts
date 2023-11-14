import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class WelcomeEmailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  hash: string;
}
