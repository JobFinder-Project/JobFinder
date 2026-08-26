import { pickDefined, toImageDataUrl, toPlainObject } from './baseDto.js';
import { toEmpresaDTO } from './empresaDto.js';

export const toVagaDTO = (vagaDoc) => {
  const v = toPlainObject(vagaDoc);
  if (!v) return null;

  return pickDefined({
    _id: v._id,
    nome: v.nome,
    area: v.area,
    requisitos: v.requisitos,
    imagem: toImageDataUrl(v.imagem),
    empresa: v.empresa?.nome ? toEmpresaDTO(v.empresa) : v.empresa,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  });
};
