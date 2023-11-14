import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateManagerDto {
  @IsMongoId()
  @IsString()
  @IsNotEmpty()
  managerId: string;
}
