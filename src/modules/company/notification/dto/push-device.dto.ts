import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpsertPushDeviceDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsIn(['ios', 'android'])
  platform: string;
}

export class DeletePushDeviceDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
