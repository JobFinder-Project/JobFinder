// Converte um documento Mongoose para um objeto JavaScript simples
export const toPlainObject = (doc) => (doc?.toObject ? doc.toObject() : doc);

// Converte a imagem armazenada no banco de dados para um formato de URL de dados (data URL)
export const toImageDataUrl = (imagem) => {
  if (!imagem?.data || !imagem?.contentType) return null;
  return `data:${imagem.contentType};base64,${imagem.data.toString('base64')}`;
};

// Filtra um objeto para incluir apenas as propriedades que têm valores definidos (não undefined)
export const pickDefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined));
