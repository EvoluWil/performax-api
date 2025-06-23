import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePayeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
