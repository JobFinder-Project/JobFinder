export const patterns = {
  email: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/,
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  cnpj: /^\d{14}$/,
  phoneBRFormatted: /^\(\d{2}\) \d{5}-\d{4}$/,
  url: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-./?%&=]*)?$/i,
  nome: /^[\p{L}\d\s.'-]{3,50}$/u,
};

const onlyDigits = (value) => String(value || '').replace(/\D/g, '');

// Validação de CPF baseada no algoritmo oficial
const isCPFChecksumValid = (cpfDigits) => {
  if (!cpfDigits || cpfDigits.length !== 11) return false;

  const calcDigit = (baseDigits, factorStart) => {
    const sum = baseDigits
      .split('')
      .reduce((acc, digit, idx) => acc + Number(digit) * (factorStart - idx), 0);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const firstDigit = calcDigit(cpfDigits.slice(0, 9), 10);
  const secondDigit = calcDigit(cpfDigits.slice(0, 10), 11);

  return firstDigit === Number(cpfDigits[9]) && secondDigit === Number(cpfDigits[10]);
};

export const validators = {
  isCPFNotRepeated: (v) => {
    const digits = onlyDigits(v);
    return digits.length === 11 && !/^(\d)\1{10}$/.test(digits);
  },
  isCPF: (v) => {
    const value = String(v || '');
    const digits = onlyDigits(value);
    return (
      patterns.cpf.test(value) && validators.isCPFNotRepeated(value) && isCPFChecksumValid(digits)
    );
  },
  isEmail: (v) => patterns.email.test(v || ''),
  isCNPJ: (v) => patterns.cnpj.test(v || ''),
  isPhoneBRFormatted: (v) => patterns.phoneBRFormatted.test(v || ''),
  isUrlOptional: (v) => !v || patterns.url.test(v),
  isNome: (v) => patterns.nome.test(v || ''),
};
