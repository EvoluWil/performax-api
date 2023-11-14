import {
  ClassConstructor,
  ClassTransformOptions,
  plainToClass,
} from 'class-transformer';

export function defaultPlainToClass<T, V>(
  cls: ClassConstructor<T>,
  plain: V,
  options?: ClassTransformOptions,
): T {
  return plainToClass(cls, plain, {
    excludeExtraneousValues: false,
    exposeUnsetFields: false,
    enableImplicitConversion: true,
    groups: ['default'],
    ...options,
  });
}
