import { pickDefined, toImageDataUrl, toPlainObject } from './baseDto.js';

export const toCandidatoDTO = (candidatoDoc) => {
  const c = toPlainObject(candidatoDoc);
  if (!c) return null;

  return pickDefined({
    _id: c._id,
    nome: c.nome,
    cpf: c.cpf,
    email: c.email,
    telefone: c.telefone,
    educacao: c.educacao,
    qualificacoes: c.qualificacoes ?? c.qualificacao,
    cursos: c.cursos,
    descricao: c.descricao,
    habilidades: c.habilidades ?? c.habilidadesTecnicas,
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
    _id: c._id,
    nome: c.nome,
    email: c.email,
    telefone: c.telefone,
    educacao: c.educacao,
    qualificacoes: c.qualificacoes ?? c.qualificacao,
    cursos: c.cursos,
    descricao: c.descricao,
    habilidades: c.habilidades ?? c.habilidadesTecnicas,
    idiomas: c.idiomas,
    imagem: toImageDataUrl(c.imagem),
  });
};
