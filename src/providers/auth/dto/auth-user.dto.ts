import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
