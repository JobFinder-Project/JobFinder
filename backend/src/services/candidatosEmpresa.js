import mongoose from 'mongoose';
import Candidato from '../models/candidatoModel.js';
import FavoritoCandidato from '../models/favoritoCandidatoModel.js';
import Vaga from '../models/vagasModel.js';
import Candidatura from '../models/candidaturaModel.js';
import Error400 from '../errors/Error400.js';
import Error404 from '../errors/Error404.js';
import { escapeRegex } from '../utils/normalizacao.js';
import { toCandidatoEmpresaDTO } from '../dtos/index.js';

const CAMPOS_CANDIDATO_RESUMO =
  'nome educacao qualificacao cursos descricao habilidadesTecnicas idiomas imagem';

export const mapCandidatosComFavoritos = async (empresaId, candidatos) => {
  const candidatosIds = candidatos.map((candidato) => candidato._id);
  const favoritos = await FavoritoCandidato.find({
    empresa: empresaId,
    candidato: { $in: candidatosIds },
  }).select('candidato');
  const favoritosIds = new Set(favoritos.map((favorito) => favorito.candidato.toString()));

  return candidatos.map((candidato) =>
    toCandidatoEmpresaDTO(candidato, {
      favoritado: favoritosIds.has(candidato._id.toString()),
    })
  );
};

export const buscarCandidatos = async (empresaId, { q, vagaId }) => {
  if ((q !== undefined && typeof q !== 'string') || (vagaId && typeof vagaId !== 'string')) {
    throw new Error400('Parâmetros de busca inválidos.');
  }

  const termo = q?.trim() || '';

  if (!vagaId && termo.length < 2) {
    throw new Error400('Informe ao menos 2 caracteres para buscar candidatos.');
  }

  if (termo && termo.length < 2) {
    throw new Error400('Informe ao menos 2 caracteres para buscar candidatos.');
  }

  if (termo.length > 80) {
    throw new Error400('O termo de busca deve ter no máximo 80 caracteres.');
  }

  const query = {};

  if (termo) {
    const termoSeguro = escapeRegex(termo);
    query.$or = [
      { qualificacao: { $regex: termoSeguro, $options: 'i' } },
      { educacao: { $regex: termoSeguro, $options: 'i' } },
      { nome: { $regex: termoSeguro, $options: 'i' } },
      { habilidadesTecnicas: { $regex: termoSeguro, $options: 'i' } },
    ];
  }

  if (vagaId) {
    if (!mongoose.isValidObjectId(vagaId)) {
      throw new Error400('Identificador de vaga inválido.');
    }

    const vaga = await Vaga.findOne({ _id: vagaId, empresa: empresaId }).select('_id');
    if (!vaga) {
      throw new Error404('Vaga não encontrada.');
    }

    const candidatosIds = await Candidatura.find({ vaga: vaga._id }).distinct('candidato');
    query._id = { $in: candidatosIds };
  }

  const candidatos = await Candidato.find(query).select(CAMPOS_CANDIDATO_RESUMO);

  return mapCandidatosComFavoritos(empresaId, candidatos);
};

export const listarFavoritos = async (empresaId) => {
  const favoritos = await FavoritoCandidato.find({ empresa: empresaId })
    .sort({ updatedAt: -1 })
    .populate('candidato', CAMPOS_CANDIDATO_RESUMO);

  return favoritos
    .filter((favorito) => favorito.candidato)
    .map((favorito) => toCandidatoEmpresaDTO(favorito.candidato, { favoritado: true }));
};

export const favoritar = async (empresaId, candidatoId) => {
  if (!mongoose.isValidObjectId(candidatoId)) {
    throw new Error400('Identificador de candidato inválido.');
  }

  const candidato = await Candidato.findById(candidatoId).select(CAMPOS_CANDIDATO_RESUMO);

  if (!candidato) {
    throw new Error404('Candidato não encontrado.');
  }

  await FavoritoCandidato.updateOne(
    { empresa: empresaId, candidato: candidato._id },
    { $setOnInsert: { empresa: empresaId, candidato: candidato._id } },
    { upsert: true }
  );

  return toCandidatoEmpresaDTO(candidato, { favoritado: true });
};

export const desfavoritar = async (empresaId, candidatoId) => {
  if (!mongoose.isValidObjectId(candidatoId)) {
    throw new Error400('Identificador de candidato inválido.');
  }

  await FavoritoCandidato.deleteOne({ empresa: empresaId, candidato: candidatoId });
};
