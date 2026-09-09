import { pickDefined, toImageDataUrl, toPlainObject } from './baseDto.js';

export const toCandidatoDTO = (candidatoDoc) => {
  const c = toPlainObject(candidatoDoc);
  if (!c) return null;

  return pickDefined({
    nome: c.nome,
    cpf: c.cpf,
    email: c.email,
    telefone: c.telefone,
    educacao: c.educacao,
    qualificacoes: c.qualificacao,
    cursos: c.cursos,
    descricao: c.descricao,
    habilidadesTecnicas: c.habilidades ?? c.habilidadesTecnicas,
    idiomas: c.idiomas,
    imagem: c.imagem?.data
      ? {
          contentType: c.imagem.contentType,
          data: c.imagem.data.toString('base64'),
        }
      : null,
  });
};

export const toCandidatoPublicDTO = (candidatoDoc) => {
  const c = toPlainObject(candidatoDoc);
  if (!c) return null;

  return pickDefined({
    nome: c.nome,
    educacao: c.educacao,
    qualificacoes: c.qualificacoes ?? c.qualificacao,
    cursos: c.cursos,
    descricao: c.descricao,
    habilidadesTecnicas: c.habilidades ?? c.habilidadesTecnicas,
    idiomas: c.idiomas,
    imagem: toImageDataUrl(c.imagem),
  });
};

export const toCandidatoResumoDTO = (candidatoDoc) => {
  const c = toPlainObject(candidatoDoc);
  if (!c) return null;

  return pickDefined({
    nome: c.nome,
    qualificacoes: c.qualificacoes ?? c.qualificacao,
    imagem: toImageDataUrl(c.imagem),
  });
};

export const toCandidatoContatoDTO = (candidatoDoc) => {
  const c = toPlainObject(candidatoDoc);
  if (!c) return null;

  return pickDefined({
    ...toCandidatoPublicDTO(c),
    email: c.email,
    telefone: c.telefone,
  });
};
