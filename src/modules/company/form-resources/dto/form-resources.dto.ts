import { IsArray, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export const RESOURCE_KEYS = [
  'users',
  'clients',
  'financeTypes',
  'financeBanks',
  'financeCategories',
  'financeSegments',
  'financePayees',
  'financePaymentMethods',
  'taskTypes',
  'employees',
] as const;

export type ResourceKey = (typeof RESOURCE_KEYS)[number];

export class FormResourcesDto {
  @IsArray()
  @IsString({ each: true })
  @IsIn([...RESOURCE_KEYS], { each: true })
  resources: ResourceKey[];

  @IsOptional()
  @IsObject()
  search?: Partial<Record<ResourceKey, string>>;
}
