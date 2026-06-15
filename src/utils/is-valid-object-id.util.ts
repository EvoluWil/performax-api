export function isValidObjectId(value: string): boolean {
  return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
}
