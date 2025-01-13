export const formatCurrency = (value: string): number => {
  if (!value) return 0;
  const formatted = value
    .replace('R$', '')
    .replaceAll('.', '')
    .replace(',', '.');
  return Number(formatted);
};
