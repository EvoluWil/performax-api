import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { isValidCNPJ } from 'src/utils/cnpj-validate.util';

export function IsCnpj(validationOptions?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsCnpj' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return isValidCNPJ(value);
  }

  defaultMessage() {
    return `CNPJ inválido`;
  }
}
