import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @IsBoolean()
  @IsOptional()
  persistent?: boolean;
}
