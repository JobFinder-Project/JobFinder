import { pickDefined, toImageDataUrl, toPlainObject } from './baseDto.js';
import { toEmpresaDTO } from './empresaDto.js';

export const toVagaDTO = (vagaDoc) => {
  const v = toPlainObject(vagaDoc);
  if (!v) return null;

  const createdAt = v.createdAt || (
    typeof v._id?.getTimestamp === 'function' ? v._id.getTimestamp() : undefined
  );

  return pickDefined({
    _id: v._id,
    nome: v.nome,
    area: v.area,
    requisitos: v.requisitos,
    status: v.status || 'Aberta',
    imagem: toImageDataUrl(v.imagem),
    empresa: v.empresa?.nome ? toEmpresaDTO(v.empresa) : v.empresa,
    createdAt,
    updatedAt: v.updatedAt,
  });
};
