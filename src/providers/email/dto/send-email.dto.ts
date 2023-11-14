import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber('BR')
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
