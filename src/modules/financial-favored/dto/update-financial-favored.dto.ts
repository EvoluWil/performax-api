import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialFavoredDto } from './create-financial-favored.dto';

export class UpdateFinancialFavoredDto extends PartialType(CreateFinancialFavoredDto) {}
