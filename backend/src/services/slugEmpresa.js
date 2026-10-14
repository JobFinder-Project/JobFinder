import Empresa from '../models/empresaModel.js';

export const slugifyEmpresaNome = (nome) => {
  const slug = String(nome || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return slug || 'empresa';
};

export const gerarSlugUnicoEmpresa = async (nome, empresaId) => {
  const baseSlug = slugifyEmpresaNome(nome);
  let slug = baseSlug;
  let tentativa = 1;
  const query = { slug };

  if (empresaId) {
    query._id = { $ne: empresaId };
  }

  while (await Empresa.exists(query)) {
    tentativa += 1;
    slug = `${baseSlug}-${tentativa}`;
    query.slug = slug;
  }

  return slug;
};
