import { pickDefined, toPlainObject } from './baseDto.js';
import { toVagaDTO } from './vagaDto.js';
import { toEmpresaDTO } from './empresaDto.js';

export const toCandidaturaDTO = (candidaturaDoc) => {
  const c = toPlainObject(candidaturaDoc);
  if (!c) return null;

  return pickDefined({
    _id: c._id,
    status: c.status,
    vaga: c.vaga?.nome ? toVagaDTO(c.vaga) : c.vaga,
    empresa: c.empresa?.nome ? toEmpresaDTO(c.empresa) : c.empresa,
    candidato: c.candidato,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  });
};
