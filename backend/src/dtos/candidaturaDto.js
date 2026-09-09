import { pickDefined, toPlainObject } from './baseDto.js';
import { toCandidatoContatoDTO } from './candidatoDto.js';
import { toVagaPublicDTO, toVagaResumoDTO } from './vagaDto.js';

export const toCandidaturaDTO = (candidaturaDoc) => {
  const c = toPlainObject(candidaturaDoc);
  if (!c) return null;

  return pickDefined({
    _id: c._id,
    status: c.status,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  });
};

export const toCandidaturaEmpresaDTO = (candidaturaDoc) => {
  const c = toPlainObject(candidaturaDoc);
  if (!c) return null;

  return pickDefined({
    ...toCandidaturaDTO(c),
    vaga: c.vaga?.nome ? toVagaResumoDTO(c.vaga) : undefined,
    candidato: c.candidato?.nome ? toCandidatoContatoDTO(c.candidato) : undefined,
  });
};

export const toCandidaturaCandidatoDTO = (candidaturaDoc) => {
  const c = toPlainObject(candidaturaDoc);
  if (!c) return null;

  return pickDefined({
    ...toCandidaturaDTO(c),
    vaga: c.vaga?.nome ? toVagaPublicDTO(c.vaga) : undefined,
  });
};
