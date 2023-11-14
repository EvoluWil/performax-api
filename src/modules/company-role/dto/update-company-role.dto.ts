import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCompanyRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
