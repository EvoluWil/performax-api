import { PartialType } from '@nestjs/mapped-types';
import { CreateBudgetTypeDto } from './create-budget-type.dto';

export class UpdateBudgetTypeDto extends PartialType(CreateBudgetTypeDto) {}
