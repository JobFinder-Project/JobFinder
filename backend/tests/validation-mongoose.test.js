/* eslint-disable no-undef */
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import Candidato from '../src/models/candidatoModel.js';
import Empresa from '../src/models/empresaModel.js';
import Vaga from '../src/models/vagasModel.js';
import Candidatura from '../src/models/candidaturaModel.js';

let mongoServer;
let uniqueId = 0;

const nextId = () => {
  uniqueId += 1;
  return uniqueId;
};

const generateValidCPF = (seed = 0) => {
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

const buildValidCandidato = () => {
  const id = nextId();
  return {
    nome: `Candidato Teste ${id}`,
    cpf: generateValidCPF(id),
    email: `candidato${id}@teste.com`,
    senha: 'senhaforte123',
    telefone: '(92) 99999-9999',
    educacao: 'Ensino Superior Completo',
  };
};

const buildValidEmpresa = () => {
  const id = nextId();
  const cnpjSuffix = String(100 + id).padStart(3, '0');
  return {
    nome: `Empresa Teste ${id}`,
    cnpj: `12345678000${cnpjSuffix}`,
    email: `empresa${id}@teste.com`,
    senha: 'senhaforte123',
    fone: '(92) 99999-9999',
    site: 'https://empresa.com',
  };
};

const buildValidVaga = (empresaId) => ({
  nome: 'Desenvolvedor Full Stack',
  area: 'TI - Tecnologia da Informação',
  requisitos: 'Experiência com Node.js, React, testes e boas práticas de arquitetura.',
  empresa: empresaId,
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Garante criação de índices únicos para testes de duplicidade
  await Candidato.init();
  await Empresa.init();
  await Candidatura.init();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  const cleanups = Object.keys(collections).map((key) => collections[key].deleteMany({}));
  await Promise.all(cleanups);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Validações de Candidato', () => {
  it('deve salvar um candidato válido', async () => {
    const candidato = new Candidato(buildValidCandidato());
    await expect(candidato.save()).resolves.toBeDefined();
  });

  it('deve falhar com email inválido', () => {
    const data = buildValidCandidato();
    data.email = 'email-invalido';
    const candidato = new Candidato(data);

    const error = candidato.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('deve falhar com CPF repetido (111.111.111-11)', () => {
    const data = buildValidCandidato();
    data.cpf = '111.111.111-11';
    const candidato = new Candidato(data);

    const error = candidato.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.cpf).toBeDefined();
  });

  it('deve falhar com telefone fora do formato esperado', () => {
    const data = buildValidCandidato();
    data.telefone = '92999999999';
    const candidato = new Candidato(data);

    const error = candidato.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.telefone).toBeDefined();
  });

  it('deve falhar ao duplicar email (índice único)', async () => {
    const data1 = buildValidCandidato();
    const data2 = buildValidCandidato();
    data2.email = data1.email;

    await new Candidato(data1).save();

    try {
      await new Candidato(data2).save();
      throw new Error('Esperava erro de duplicidade');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    }
  });
});

describe('Validações de Empresa', () => {
  it('deve salvar empresa válida', async () => {
    const empresa = new Empresa(buildValidEmpresa());
    await expect(empresa.save()).resolves.toBeDefined();
  });

  it('deve falhar com CNPJ inválido', () => {
    const data = buildValidEmpresa();
    data.cnpj = '123';
    const empresa = new Empresa(data);

    const error = empresa.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.cnpj).toBeDefined();
  });

  it('deve falhar com telefone inválido', () => {
    const data = buildValidEmpresa();
    data.fone = '123';
    const empresa = new Empresa(data);

    const error = empresa.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.fone).toBeDefined();
  });

  it('deve falhar com site inválido', () => {
    const data = buildValidEmpresa();
    data.site = 'site_invalido';
    const empresa = new Empresa(data);

    const error = empresa.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.site).toBeDefined();
  });
});

describe('Validações de Vaga', () => {
  it('deve salvar vaga válida', async () => {
    const empresa = await new Empresa(buildValidEmpresa()).save();
    const vaga = new Vaga(buildValidVaga(empresa._id));

    await expect(vaga.save()).resolves.toBeDefined();
  });

  it('deve falhar com área inválida (enum)', async () => {
    const empresa = await new Empresa(buildValidEmpresa()).save();
    const data = buildValidVaga(empresa._id);
    data.area = 'Área inexistente';

    const vaga = new Vaga(data);
    const error = vaga.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.area).toBeDefined();
  });

  it('deve falhar com requisitos muito curtos', async () => {
    const empresa = await new Empresa(buildValidEmpresa()).save();
    const data = buildValidVaga(empresa._id);
    data.requisitos = 'curto';

    const vaga = new Vaga(data);
    const error = vaga.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.requisitos).toBeDefined();
  });
});

describe('Validações de Candidatura', () => {
  it('deve salvar candidatura válida com status padrão', async () => {
    const candidato = await new Candidato(buildValidCandidato()).save();
    const empresa = await new Empresa(buildValidEmpresa()).save();
    const vaga = await new Vaga(buildValidVaga(empresa._id)).save();

    const candidatura = new Candidatura({
      candidato: candidato._id,
      vaga: vaga._id,
      empresa: empresa._id,
    });

    const saved = await candidatura.save();
    expect(saved.status).toBe('Pendente');
  });

  it('deve falhar com status inválido', () => {
    const candidatura = new Candidatura({
      candidato: new mongoose.Types.ObjectId(),
      vaga: new mongoose.Types.ObjectId(),
      empresa: new mongoose.Types.ObjectId(),
      status: 'Em análise',
    });

    const error = candidatura.validateSync();
    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  it('deve falhar ao duplicar candidatura para o mesmo candidato/vaga', async () => {
    const candidato = await new Candidato(buildValidCandidato()).save();
    const empresa = await new Empresa(buildValidEmpresa()).save();
    const vaga = await new Vaga(buildValidVaga(empresa._id)).save();

    await new Candidatura({
      candidato: candidato._id,
      vaga: vaga._id,
      empresa: empresa._id,
    }).save();

    try {
      await new Candidatura({
        candidato: candidato._id,
        vaga: vaga._id,
        empresa: empresa._id,
      }).save();

      throw new Error('Esperava erro de duplicidade na candidatura');
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.code).toBe(11000);
    }
  });
});
