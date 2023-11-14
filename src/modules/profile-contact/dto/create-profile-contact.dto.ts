import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateProfileContactDto {
  @IsPhoneNumber('BR')
  @IsString()
  @IsNotEmpty()
  phone: string;
}
