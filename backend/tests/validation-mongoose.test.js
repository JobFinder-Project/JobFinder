import { afterAll, afterEach, beforeAll, describe, expect, it } from '@jest/globals';

import Candidato from '../src/models/candidatoModel.js';
import Candidatura from '../src/models/candidaturaModel.js';
import Empresa from '../src/models/empresaModel.js';
import Vaga from '../src/models/vagasModel.js';
import { clearTestDatabase, startTestDatabase, stopTestDatabase } from './helpers/database.js';
import { buildCandidato, buildCandidatura, buildEmpresa, buildVaga } from './helpers/factories.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await startTestDatabase();
});

afterEach(async () => {
  await clearTestDatabase();
});

afterAll(async () => {
  await stopTestDatabase(mongoServer);
});

describe('Validações de candidato', () => {
  it('deve salvar um candidato válido', async () => {
    const candidato = new Candidato(buildCandidato());

    await expect(candidato.save()).resolves.toBeDefined();
  });

  it('deve falhar com email inválido', () => {
    const candidato = new Candidato(buildCandidato({ email: 'email-invalido' }));
    const error = candidato.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('deve falhar com CPF inválido ou repetido', () => {
    const cpfSemChecksum = new Candidato(buildCandidato({ cpf: '123.456.789-00' }));
    const cpfRepetido = new Candidato(buildCandidato({ cpf: '111.111.111-11' }));

    expect(cpfSemChecksum.validateSync().errors.cpf).toBeDefined();
    expect(cpfRepetido.validateSync().errors.cpf).toBeDefined();
  });

  it('deve falhar com telefone fora do formato brasileiro esperado', () => {
    const candidato = new Candidato(buildCandidato({ telefone: '92999999999' }));
    const error = candidato.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.telefone).toBeDefined();
  });

  it('deve falhar com senha menor que oito caracteres', () => {
    const candidato = new Candidato(buildCandidato({ senha: '1234567' }));
    const error = candidato.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.senha).toBeDefined();
  });

  it('deve falhar ao duplicar email por índice único', async () => {
    const candidato = buildCandidato();

    await new Candidato(candidato).save();

    await expect(
      new Candidato(buildCandidato({ email: candidato.email })).save()
    ).rejects.toMatchObject({ code: 11000 });
  });
});

describe('Validações de empresa', () => {
  it('deve salvar empresa válida', async () => {
    const empresa = new Empresa(buildEmpresa());

    await expect(empresa.save()).resolves.toBeDefined();
  });

  it('deve falhar com CNPJ inválido', () => {
    const empresa = new Empresa(buildEmpresa({ cnpj: '123' }));
    const error = empresa.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.cnpj).toBeDefined();
  });

  it('deve falhar com email inválido', () => {
    const empresa = new Empresa(buildEmpresa({ email: 'email-invalido' }));
    const error = empresa.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('deve falhar com telefone inválido', () => {
    const empresa = new Empresa(buildEmpresa({ fone: '123' }));
    const error = empresa.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.fone).toBeDefined();
  });

  it('deve falhar com site inválido', () => {
    const empresa = new Empresa(buildEmpresa({ site: 'site_invalido' }));
    const error = empresa.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.site).toBeDefined();
  });

  it('deve falhar com senha menor que oito caracteres', () => {
    const empresa = new Empresa(buildEmpresa({ senha: '1234567' }));
    const error = empresa.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.senha).toBeDefined();
  });
});

describe('Validações de vaga', () => {
  it('deve salvar vaga válida', async () => {
    const empresa = await new Empresa(buildEmpresa()).save();
    const vaga = new Vaga(buildVaga(empresa._id));

    await expect(vaga.save()).resolves.toBeDefined();
  });

  it('deve falhar com área inválida', async () => {
    const empresa = await new Empresa(buildEmpresa()).save();
    const vaga = new Vaga(buildVaga(empresa._id, { area: 'Área inexistente' }));
    const error = vaga.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.area).toBeDefined();
  });

  it('deve falhar com requisitos muito curtos', async () => {
    const empresa = await new Empresa(buildEmpresa()).save();
    const vaga = new Vaga(buildVaga(empresa._id, { requisitos: 'curto' }));
    const error = vaga.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.requisitos).toBeDefined();
  });

  it('deve falhar sem empresa vinculada', () => {
    const vaga = new Vaga(buildVaga(undefined, { empresa: undefined }));
    const error = vaga.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.empresa).toBeDefined();
  });
});

describe('Validações de candidatura', () => {
  it('deve salvar candidatura válida com status padrão', async () => {
    const candidato = await new Candidato(buildCandidato()).save();
    const empresa = await new Empresa(buildEmpresa()).save();
    const vaga = await new Vaga(buildVaga(empresa._id)).save();

    const saved = await new Candidatura(
      buildCandidatura({
        candidatoId: candidato._id,
        vagaId: vaga._id,
        empresaId: empresa._id,
        status: undefined,
      })
    ).save();

    expect(saved.status).toBe('Pendente');
  });

  it('deve falhar com status inválido', () => {
    const candidatura = new Candidatura(buildCandidatura({ status: 'Em análise' }));
    const error = candidatura.validateSync();

    expect(error).toBeDefined();
    expect(error.errors.status).toBeDefined();
  });

  it('deve falhar ao duplicar candidatura para o mesmo candidato e vaga', async () => {
    const candidato = await new Candidato(buildCandidato()).save();
    const empresa = await new Empresa(buildEmpresa()).save();
    const vaga = await new Vaga(buildVaga(empresa._id)).save();
    const payload = {
      candidatoId: candidato._id,
      vagaId: vaga._id,
      empresaId: empresa._id,
    };

    await new Candidatura(buildCandidatura(payload)).save();

    await expect(new Candidatura(buildCandidatura(payload)).save()).rejects.toMatchObject({
      code: 11000,
    });
  });
});
