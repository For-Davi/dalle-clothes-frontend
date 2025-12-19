export const formatToReal = (value: string | number): string => {
  const valueFormatted = String(value);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(valueFormatted));
};
