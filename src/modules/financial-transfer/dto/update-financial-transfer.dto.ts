import { PartialType } from '@nestjs/mapped-types';
import { CreateFinancialTransferDto } from './create-financial-transfer.dto';

export class UpdateFinancialTransferDto extends PartialType(CreateFinancialTransferDto) {}
