import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOccurrenceTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
