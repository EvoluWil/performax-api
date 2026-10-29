import { FinanceFlowEnum } from '@prisma/client';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

type FinanceOutShape = {
  flow?: FinanceFlowEnum;
  clientId?: string;
  employeeId?: string;
  payeeId?: string;
};

@ValidatorConstraint({ name: 'FinanceOutFields', async: false })
export class FinanceOutFieldsConstraint implements ValidatorConstraintInterface {
  validate(_: unknown, args: ValidationArguments) {
    const o = args.object as FinanceOutShape;
    if (o.flow !== FinanceFlowEnum.OUT) return true;
    if (!o.clientId?.trim()) return false;
    const hasEmployee = !!o.employeeId?.trim();
    const hasPayee = !!o.payeeId?.trim();
    if (hasEmployee === hasPayee) return false;
    return true;
  }

  defaultMessage() {
    return 'Saída exige centro de custo e Pago a (funcionário ou favorecido, exclusivamente um)';
  }
}
