import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanySectorDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
