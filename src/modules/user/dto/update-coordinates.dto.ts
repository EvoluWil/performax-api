import { IsArray } from 'class-validator';

export class UpdateCoordinatesDto {
  @IsArray({ each: true })
  coordinates: string[];
}
