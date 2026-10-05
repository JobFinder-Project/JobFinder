import { pickDefined, toImageDataUrl, toPlainObject } from './baseDto.js';

export const toEmpresaDTO = (empresaDoc) => {
  const e = toPlainObject(empresaDoc);
  if (!e) return null;

  return pickDefined({
    nome: e.nome,
    slug: e.slug,
    cnpj: e.cnpj,
    email: e.email,
    fone: e.fone,
    bio: e.bio,
    site: e.site,
    segmento: e.segmento,
    localizacao: e.localizacao,
    tamanhoEmpresa: e.tamanhoEmpresa,
    anoFundacao: e.anoFundacao,
    missao: e.missao,
    valores: e.valores,
    beneficios: e.beneficios,
    imagem: toImageDataUrl(e.imagem),
  });
};

export const toEmpresaPublicDTO = (empresaDoc) => {
  const e = toPlainObject(empresaDoc);
  if (!e) return null;

  return pickDefined({
    nome: e.nome,
    slug: e.slug,
    bio: e.bio,
    site: e.site,
    imagem: toImageDataUrl(e.imagem),
  });
};

export const toEmpresaPublicProfileDTO = (empresaDoc) => {
  const e = toPlainObject(empresaDoc);
  if (!e) return null;

  return pickDefined({
    nome: e.nome,
    slug: e.slug,
    bio: e.bio,
    site: e.site,
    segmento: e.segmento,
    localizacao: e.localizacao,
    tamanhoEmpresa: e.tamanhoEmpresa,
    anoFundacao: e.anoFundacao,
    missao: e.missao,
    valores: e.valores,
    beneficios: e.beneficios,
    imagem: toImageDataUrl(e.imagem),
  });
};
