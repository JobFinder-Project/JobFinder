import bcrypt from 'bcrypt';
import Candidato from '../models/candidatoModel.js';
import Empresa from '../models/empresaModel.js';
import Vaga from '../models/vagasModel.js';
import Candidatura from '../models/candidaturaModel.js';
import Error400 from '../errors/Error400.js';
import Error404 from '../errors/Error404.js';
import { toCandidatoPublicDTO, toEmpresaDTO, toVagaDTO, toCandidaturaDTO } from '../dtos/index.js';

class EmpresaController {
  static async cadastrarEmpresa(req, res, next) {
    try {
      const { email, senha } = req.body;
      const userExiste = (await Candidato.findOne({ email })) || (await Empresa.findOne({ email }));

      if (userExiste) {
        return next(new Error400('Email já utilizado no sistema'));
      }

      if (typeof senha !== 'string') {
        return next(new Error400('O campo senha deve ser texto.'));
      }

      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senha, salt);

      const novaEmpresa = new Empresa({
        nome: req.body.nome,
        email: email,
        cnpj: req.body.cnpj,
        senha: senhaHash,
        fone: req.body.fone,
        bio: req.body.bio || '',
        site: req.body.site || '',
      });

      await novaEmpresa.save();
      res.status(201).json({ success: true, message: 'Empresa cadastrada com sucesso' });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async acessarDashboard(req, res, next) {
    try {
      const empresa = await Empresa.findById(req.session.user.id);

      if (!empresa) {
        return next(new Error404('Perfil de empresa não encontrado.'));
      }

      const vagas = await Vaga.find({ empresa: empresa._id });

      res.status(200).json({
        empresa: toEmpresaDTO(empresa),
        vagas: vagas.map(toVagaDTO),
      });
    } catch (erro) {
      console.error('Erro no Dashboard Empresa:', erro);
      next(erro);
    }
  }

  static async editarPerfil(req, res, next) {
    try {
      const empresaId = req.session.user.id;
      const { nome, email, fone, bio, site } = req.body;

      const empresa = await Empresa.findById(empresaId);
      if (!empresa) {
        return next(new Error404('Empresa não encontrada.'));
      }

      if (nome !== undefined) empresa.nome = nome;
      if (email !== undefined) empresa.email = email;
      if (fone !== undefined) empresa.fone = fone;
      if (bio !== undefined) empresa.bio = bio;
      if (site !== undefined) empresa.site = site;

      await empresa.save();

      res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        empresa: toEmpresaDTO(empresa),
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async criarVagas(req, res, next) {
    try {
      const empresaId = req.session.user.id;
      const { nome, area, requisitos } = req.body;

      const empresa = await Empresa.findById(empresaId);
      if (!empresa) {
        return next(new Error404('Empresa não encontrada.'));
      }

      const dadosVaga = {
        nome,
        area,
        requisitos,
        empresa: empresa._id,
      };

      if (req.file) {
        dadosVaga.imagem = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }

      const novaVaga = new Vaga(dadosVaga);
      await novaVaga.save();

      empresa.vagas.push(novaVaga._id);
      await empresa.save();

      res.status(201).json({
        success: true,
        message: 'Vaga criada com sucesso',
        vaga: toVagaDTO(novaVaga),
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async atualizarStatusVaga(req, res, next) {
    try {
      const empresaId = req.session.user.id;
      const { vagaId } = req.params;
      const { status } = req.body;

      if (!['Aberta', 'Fechada'].includes(status)) {
        return next(new Error400('Status de vaga inválido. Use Aberta ou Fechada.'));
      }

      const vaga = await Vaga.findOne({ _id: vagaId, empresa: empresaId });
      if (!vaga) {
        return next(new Error404('Vaga não encontrada.'));
      }

      vaga.status = status;
      await vaga.save();

      res.status(200).json({
        success: true,
        message: `Vaga ${status === 'Aberta' ? 'reaberta' : 'encerrada'} com sucesso`,
        vaga: toVagaDTO(vaga),
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async buscarCandidaturas(req, res, next) {
    try {
      const empresaId = req.session.user.id;

      const vagas = await Vaga.find({ empresa: empresaId }).select('_id');
      const vagasIds = vagas.map((vaga) => vaga._id);

      const candidaturas = await Candidatura.find({ vaga: { $in: vagasIds } })
        .populate('candidato', '-senha')
        .populate('vaga', 'nome area requisitos');
      res.status(200).json({
        candidaturas: candidaturas.map(toCandidaturaDTO),
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async atualizarStatusCandidatura(req, res, next) {
    try {
      const empresaId = req.session.user.id;
      const { candidaturaId } = req.params;
      const { status } = req.body;

      const candidatura = await Candidatura.findById(candidaturaId).populate('vaga');
      if (!candidatura) {
        return next(new Error404('Candidatura não encontrada.'));
      }

      if (candidatura.vaga.empresa.toString() !== empresaId) {
        return next(new Error400('A vaga desta candidatura não pertence à empresa autenticada.'));
      }

      candidatura.status = status;
      await candidatura.save();

      res.status(200).json({
        success: true,
        message: 'Status da candidatura atualizado com sucesso',
        candidatura: toCandidaturaDTO(candidatura),
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async buscarCandidatos(req, res, next) {
    try {
      const { q } = req.query;

      const candidatos = await Candidato.find(
        {
          $or: [
            { qualificacao: { $regex: q || '', $options: 'i' } },
            { educacao: { $regex: q || '', $options: 'i' } },
            { nome: { $regex: q || '', $options: 'i' } },
          ],
        },
        '-senha'
      );

      res.status(200).json({
        candidatos: candidatos.map(toCandidatoPublicDTO),
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }
}

export default EmpresaController;
