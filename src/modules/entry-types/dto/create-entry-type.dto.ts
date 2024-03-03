import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEntryTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
