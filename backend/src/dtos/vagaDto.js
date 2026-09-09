import { pickDefined, toImageDataUrl, toPlainObject } from './baseDto.js';
import { toEmpresaPublicDTO } from './empresaDto.js';

export const toVagaDTO = (vagaDoc) => {
  const v = toPlainObject(vagaDoc);
  if (!v) return null;

  const createdAt =
    v.createdAt || (typeof v._id?.getTimestamp === 'function' ? v._id.getTimestamp() : undefined);

  return pickDefined({
    _id: v._id,
    nome: v.nome,
    area: v.area,
    requisitos: v.requisitos,
    status: v.status || 'Aberta',
    imagem: toImageDataUrl(v.imagem),
    createdAt,
    updatedAt: v.updatedAt,
  });
};

export const toVagaResumoDTO = (vagaDoc) => {
  const v = toPlainObject(vagaDoc);
  if (!v) return null;

  return pickDefined({
    _id: v._id,
    nome: v.nome,
  });
};

export const toVagaPublicDTO = (vagaDoc) => {
  const v = toPlainObject(vagaDoc);
  if (!v) return null;

  return pickDefined({
    ...toVagaDTO(v),
    empresa: v.empresa?.nome ? toEmpresaPublicDTO(v.empresa) : undefined,
  });
};
