import { IsArray } from 'class-validator';

export class UpdateCoordinatesDto {
  @IsArray()
  coordinates: string[];
}
