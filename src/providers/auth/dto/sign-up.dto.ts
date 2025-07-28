import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { CreateCompanyDto } from 'src/modules/company/index/dto/create-company.dto';
import { CredentialDto } from './credentials.dto';
import { ProfileDto } from './profile.dto';

export class SignUpDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ProfileDto)
  profile: ProfileDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => CredentialDto)
  credentials: CredentialDto;

  @Type(() => CreateCompanyDto)
  @ValidateNested()
  @IsObject()
  @IsNotEmpty()
  company: CreateCompanyDto;
}
