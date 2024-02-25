import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { isValidCNPJ } from 'src/utils/cnpj-validate.util';

export function IsCnpj(
  validationOptions?: ValidationOptions,
  nullable = false,
) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: MatchConstraint,
      constraints: [nullable],
    });
  };
}

@ValidatorConstraint({ name: 'IsCnpj' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: any) {
    if (args?.constraints.length && args?.constraints[0] && !value) {
      return true;
    }
    return isValidCNPJ(value);
  }

  defaultMessage() {
    return `CNPJ inválido`;
  }
}
