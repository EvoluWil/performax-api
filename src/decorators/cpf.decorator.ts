import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { isValidCPF } from 'src/utils/cpf-validate.util';

export function IsCpf(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsCpf' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: string) {
    return isValidCPF(value);
  }

  defaultMessage() {
    return 'CPF inválido';
  }
}
