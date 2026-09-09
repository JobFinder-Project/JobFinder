import { describe, expect, it } from '@jest/globals';

import { swaggerOptions } from '../src/docs/swagger/options.js';

const { schemas } = swaggerOptions.definition.components;
const { paths } = swaggerOptions.definition;

describe('Contrato Swagger de exposição de dados', () => {
  it('documenta o candidato público sem contato ou identificadores internos', () => {
    const properties = schemas.CandidatoPublico.properties;

    expect(properties).toHaveProperty('nome');
    expect(properties).toHaveProperty('habilidadesTecnicas');
    expect(properties).not.toHaveProperty('_id');
    expect(properties).not.toHaveProperty('cpf');
    expect(properties).not.toHaveProperty('email');
    expect(properties).not.toHaveProperty('telefone');
  });

  it('documenta a empresa pública sem dados internos ou de contato', () => {
    const properties = schemas.EmpresaPublica.properties;

    expect(properties).toHaveProperty('nome');
    expect(properties).not.toHaveProperty('_id');
    expect(properties).not.toHaveProperty('cnpj');
    expect(properties).not.toHaveProperty('email');
    expect(properties).not.toHaveProperty('fone');
  });

  it('documenta os critérios mínimos e o filtro por vínculo da busca de candidatos', () => {
    const operation = paths['/empresa/candidatos/buscar'].get;
    const q = operation.parameters.find((parameter) => parameter.name === 'q');
    const vagaId = operation.parameters.find((parameter) => parameter.name === 'vagaId');

    expect(q.schema).toMatchObject({ minLength: 2, maxLength: 80 });
    expect(vagaId).toBeDefined();
    expect(operation.responses[400]).toBeDefined();
    expect(operation.responses[404]).toBeDefined();
  });

  it('referencia DTOs específicos nas listagens de vagas e candidaturas', () => {
    expect(paths['/vagas'].get.responses[200].content['application/json'].schema.$ref).toBe(
      '#/components/schemas/VagasResponse'
    );
    expect(
      paths['/empresa/candidaturas'].get.responses[200].content['application/json'].schema.$ref
    ).toBe('#/components/schemas/CandidaturasEmpresaResponse');
    expect(
      paths['/candidato/candidaturas'].get.responses[200].content['application/json'].schema.$ref
    ).toBe('#/components/schemas/CandidaturasCandidatoResponse');
    expect(
      paths['/candidato/vagas/{vagaId}'].post.responses[201].content['application/json'].schema.$ref
    ).toBe('#/components/schemas/CandidaturaMutationResponse');
    expect(
      paths['/empresa/vagas/{vagaId}/status'].patch.responses[200].content['application/json']
        .schema.$ref
    ).toBe('#/components/schemas/VagaMutationResponse');
  });
});
