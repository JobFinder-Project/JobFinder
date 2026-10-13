export const getImagemSrc = (imagem) => {
    if (!imagem) return null;
    if (typeof imagem === 'string') return imagem;
    if (imagem.data && imagem.contentType) {
        return `data:${imagem.contentType};base64,${imagem.data}`;
    }
    return null;
};
