import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialContractDto } from './create-financial-contract.dto';

export class UpdateFinancialContractDto extends PartialType(CreateFinancialContractDto) {}
