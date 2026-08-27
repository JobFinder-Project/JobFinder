import bcrypt from 'bcrypt';
import Candidato from '../models/candidatoModel.js';
import Vaga from '../models/vagasModel.js';
import Candidatura from '../models/candidaturaModel.js';
import Empresa from '../models/empresaModel.js';
import Error400 from '../errors/Error400.js';
import Error404 from '../errors/Error404.js';
import { toCandidaturaDTO, toCandidatoDTO, toVagaDTO } from '../dtos/index.js';

class CandidatoController {
  static async cadastrarCandidato(req, res, next) {
    try {
      const { email, senha } = req.body;
      const userExiste = (await Candidato.findOne({ email })) || (await Empresa.findOne({ email }));

      if (userExiste) {
        return next(new Error400('Email já utilizado no sistema'));
      }

      if (typeof senha !== 'string') {
        return next(new Error400('Campo senha deve ser uma string'));
      }

      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senha, salt);

      const novoCandidato = new Candidato({
        nome: req.body.nome,
        cpf: req.body.cpf,
        email: req.body.email,
        senha: senhaHash,
        telefone: req.body.telefone,
        educacao: req.body.educacao,
        qualificacao: req.body.qualificacoes,
        cursos: req.body.cursos,
        descricao: req.body.descricao,
        habilidadesTecnicas: req.body.habilidades,
        idiomas: req.body.idiomas,
        imagem: req.file
          ? {
              data: req.file.buffer,
              contentType: req.file.mimetype,
            }
          : undefined,
      });

      await novoCandidato.save();
      res.status(201).json({ success: true, message: 'Cadastro realizado com sucesso' });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async acessarDashboard(req, res, next) {
    try {
      const candidatoId = req.session.user.id;
      const vagas = await Vaga.find().populate('empresa');
      const candidato = await Candidato.findById(candidatoId, '-senha');

      if (!candidato) {
        return next(new Error404('Candidato não encontrado'));
      }

      const areas = [...new Set(vagas.map((vaga) => vaga.area))];

      res.status(200).json({
        candidatoId,
        candidato: toCandidatoDTO(candidato),
        vagas: vagas.map(toVagaDTO),
        areas,
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async editarPerfil(req, res, next) {
    try {
      const candidatoId = req.session.user.id;
      const {
        nome,
        email,
        telefone,
        educacao,
        qualificacao,
        cursos,
        descricao,
        habilidadesTecnicas,
        idiomas,
      } = req.body;

      const candidato = await Candidato.findById(candidatoId);
      if (!candidato) {
        return next(new Error404('Candidato não encontrado'));
      }

      if (nome !== undefined) candidato.nome = nome;
      if (email !== undefined) candidato.email = email;
      if (telefone !== undefined) candidato.telefone = telefone;
      if (educacao !== undefined) candidato.educacao = educacao;
      if (qualificacao !== undefined) candidato.qualificacao = qualificacao;
      if (descricao !== undefined) candidato.descricao = descricao;
      if (habilidadesTecnicas !== undefined) candidato.habilidadesTecnicas = habilidadesTecnicas;
      if (cursos !== undefined) {
        candidato.cursos =
          typeof cursos === 'string'
            ? cursos
                .split(',')
                .map((c) => c.trim())
                .filter((c) => c)
            : cursos;
      }
      if (idiomas !== undefined) {
        let listaIdiomas = Array.isArray(idiomas)
          ? idiomas
          : typeof idiomas === 'string'
            ? idiomas.split(',')
            : [];
        candidato.idiomas = listaIdiomas.map((i) => i.trim()).filter((i) => i);
      }

      if (req.file) {
        candidato.imagem = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      await candidato.save();

      res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async realizarCandidatura(req, res, next) {
    try {
      const candidatoId = req.session.user.id;
      const vagaId = req.params.vagaId;

      const candidaturaExistente = await Candidatura.findOne({
        candidato: candidatoId,
        vaga: vagaId,
      });

      if (candidaturaExistente) {
        return next(new Error400('Você já se candidatou para esta vaga'));
      }

      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        return next(new Error404('Vaga não encontrada'));
      }

      const novaCandidatura = new Candidatura({
        candidato: candidatoId,
        vaga: vagaId,
        empresa: vaga.empresa,
        status: 'Pendente',
      });

      await novaCandidatura.save();
      res.status(201).json({
        success: true,
        message: 'Candidatura realizada com sucesso',
        candidatura: toCandidaturaDTO(novaCandidatura),
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async listarCandidaturas(req, res, next) {
    try {
      const candidatoId = req.session.user.id;
      const candidaturas = await Candidatura.find({
        candidato: candidatoId,
      }).populate({
        path: 'vaga',
        populate: { path: 'empresa' },
      });

      res.status(200).json({
        candidaturas: candidaturas.map(toCandidaturaDTO),
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async deletarCandidatura(req, res, next) {
    try {
      const { candidaturaId } = req.params;
      await Candidatura.findByIdAndDelete(candidaturaId);
      res.status(200).json({ success: true, message: 'Candidatura deletada com sucesso' });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }
}

export default CandidatoController;
