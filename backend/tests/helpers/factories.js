import mongoose from 'mongoose';

let uniqueId = 0;

export const nextTestId = () => {
  uniqueId += 1;
  return uniqueId;
};

export const generateValidCPF = (seed = nextTestId()) => {
  const n = Array.from({ length: 9 }, (_, idx) => ((seed + idx * 7) % 9) + 1);

  const calcDigit = (baseDigits, factorStart) => {
    const sum = baseDigits.reduce((acc, digit, idx) => acc + digit * (factorStart - idx), 0);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calcDigit(n, 10);
  const d2 = calcDigit([...n, d1], 11);
  const digits = [...n, d1, d2].join('');

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

export const buildCandidato = (overrides = {}) => {
  const id = nextTestId();

  return {
    nome: `Candidato Teste ${id}`,
    cpf: generateValidCPF(id),
    email: `candidato.${id}@teste.com`,
    senha: 'senhaforte123',
    telefone: '(92) 99999-9999',
    educacao: 'Ensino Superior Completo',
    qualificacao: 'Desenvolvedor Frontend',
    qualificacoes: 'Desenvolvedor Frontend',
    cursos: ['React', 'Node.js'],
    descricao: ['Profissional com experiência em desenvolvimento web.'],
    habilidadesTecnicas: ['React', 'Node.js', 'MongoDB'],
    habilidades: ['React', 'Node.js', 'MongoDB'],
    idiomas: ['Português', 'Inglês'],
    ...overrides,
  };
};

export const buildEmpresa = (overrides = {}) => {
  const id = nextTestId();

  return {
    nome: `Empresa Teste ${id}`,
    cnpj: String(12345678000000 + id),
    email: `empresa.${id}@teste.com`,
    senha: 'senhaempresaforte',
    fone: '(92) 99999-9999',
    bio: 'Empresa de tecnologia focada em soluções digitais.',
    site: 'https://empresa.com.br',
    ...overrides,
  };
};

export const buildVaga = (empresaId = new mongoose.Types.ObjectId(), overrides = {}) => ({
  nome: 'Desenvolvedor Full Stack',
  area: 'TI - Tecnologia da Informação',
  requisitos: 'Experiência com Node.js, React, testes automatizados e boas práticas.',
  empresa: empresaId,
  ...overrides,
});

export const buildCandidatura = ({ candidatoId, vagaId, empresaId, ...overrides } = {}) => ({
  candidato: candidatoId || new mongoose.Types.ObjectId(),
  vaga: vagaId || new mongoose.Types.ObjectId(),
  empresa: empresaId || new mongoose.Types.ObjectId(),
  status: 'Pendente',
  ...overrides,
});
