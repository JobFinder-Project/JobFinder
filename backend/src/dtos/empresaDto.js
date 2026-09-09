import { pickDefined, toImageDataUrl, toPlainObject } from './baseDto.js';

export const toEmpresaDTO = (empresaDoc) => {
  const e = toPlainObject(empresaDoc);
  if (!e) return null;

  return pickDefined({
    nome: e.nome,
    cnpj: e.cnpj,
    email: e.email,
    fone: e.fone,
    bio: e.bio,
    site: e.site,
    imagem: toImageDataUrl(e.imagem),
  });
};

export const toEmpresaPublicDTO = (empresaDoc) => {
  const e = toPlainObject(empresaDoc);
  if (!e) return null;

  return pickDefined({
    nome: e.nome,
    bio: e.bio,
    site: e.site,
    imagem: toImageDataUrl(e.imagem),
  });
};
