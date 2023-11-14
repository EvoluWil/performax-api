import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  sectorId: string;
}
