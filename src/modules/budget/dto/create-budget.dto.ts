import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  value: string;

  @IsNotEmpty()
  @IsMongoId()
  typeId: string;

  @IsOptional()
  @IsMongoId()
  clientId: string;

  @IsOptional()
  @IsMongoId()
  taskId: string;

  @IsOptional()
  @IsMongoId()
  closeTaskId: string;

  @IsString()
  @IsNotEmpty()
  items: string;

  @IsString()
  @IsOptional()
  observation: string;

  @IsOptional()
  @IsMongoId()
  responsibleId: string;
}
