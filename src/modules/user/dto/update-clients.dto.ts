import { IsArray, IsMongoId } from 'class-validator';

export class UpdateClientsDto {
  @IsArray()
  @IsMongoId({ each: true })
  clients: string[];
}
