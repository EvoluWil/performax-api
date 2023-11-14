export const isValidCPF = (value: any) => {
  // Validar se é String
  if (typeof value !== 'string') {
    return false;
  }

  // Tirar formatação
  value = value.replace(/[^\d]+/g, '');

  // Validar se tem tamanho 11 ou se é uma sequência de dígitos repetidos
  if (value.length !== 11 || !!value.match(/(\d)\1{10}/)) {
    return false;
  }

  // String para Array
  const cpf = value.split('');

  const validator = cpf
    // Pegar os últimos 2 dígitos de validação
    .filter(
      (digit: string, index: number, array: string | string[]) =>
        index >= array.length - 2 && digit,
    )
    // Transformar dígitos em números
    .map((el: string) => +el);

  const toValidate = (pop: number) =>
    cpf
      // Pegar Array de items para validar
      .filter(
        (digit: string, index: number, array: string | string[]) =>
          index < array.length - pop && digit,
      )
      // Transformar dígitos em números
      .map((el: string) => +el);

  const rest = (count: number, pop: number) =>
    ((toValidate(pop)
      // Calcular Soma dos dígitos e multiplicar por 10
      .reduce(
        (acc: number, cur: number, index: number) =>
          acc + cur * (count - index),
        0,
      ) *
      10) %
      // Pegar o resto por 11
      11) %
    // transformar de 10 para 0
    10;

  return !(rest(10, 2) !== validator[0] || rest(11, 1) !== validator[1]);
};
