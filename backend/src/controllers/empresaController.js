import bcrypt from 'bcrypt';
import Candidato from '../models/candidatoModel.js';
import Empresa from '../models/empresaModel.js';
import Vaga from '../models/vagasModel.js';
import Candidatura from '../models/candidaturaModel.js';
import Error400 from '../errors/Error400.js';
import Error404 from '../errors/Error404.js';
import { encerrarSessao, validarSenhaDeConfirmacao } from '../utils/conta.js';
import { isAllowedVagaImageMetadata, isAllowedVagaImageContent } from '../utils/imagemVaga.js';
import {
  buscarCandidatos,
  listarFavoritos,
  favoritar,
  desfavoritar,
} from '../services/candidatosEmpresa.js';
import { gerarSlugUnicoEmpresa } from '../services/slugEmpresa.js';
import { normalizeListField, normalizeAnoFundacao } from '../utils/normalizacao.js';
import {
  toCandidatoResumoDTO,
  toEmpresaDTO,
  toEmpresaPublicProfileDTO,
  toVagaDTO,
  toCandidaturaDTO,
  toCandidaturaEmpresaDTO,
} from '../dtos/index.js';
import {
  POLITICA_PRIVACIDADE_VERSAO_ATUAL,
  TERMOS_USO_VERSAO_ATUAL,
} from '../config/consentimentos.js';

const publicOpenVagaStatusFilter = {
  $or: [{ status: 'Aberta' }, { status: { $exists: false } }, { status: null }],
};

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

      if (req.body.aceiteTermosUso !== true) {
        return next(new Error400('É obrigatório aceitar os Termos de Uso.'));
      }

      if (req.body.aceitePoliticaPrivacidade !== true) {
        return next(new Error400('É obrigatório aceitar a Política de Privacidade.'));
      }

      const salt = await bcrypt.genSalt(12);
      const senhaHash = await bcrypt.hash(senha, salt);
      const slug = await gerarSlugUnicoEmpresa(req.body.nome);

      const novaEmpresa = new Empresa({
        nome: req.body.nome,
        slug,
        email: email,
        cnpj: req.body.cnpj,
        senha: senhaHash,
        fone: req.body.fone,
        bio: req.body.bio || '',
        site: req.body.site || '',
        segmento: req.body.segmento || '',
        localizacao: req.body.localizacao || '',
        tamanhoEmpresa: req.body.tamanhoEmpresa || '',
        anoFundacao: normalizeAnoFundacao(req.body.anoFundacao),
        missao: req.body.missao || '',
        valores: normalizeListField(req.body.valores) || [],
        beneficios: normalizeListField(req.body.beneficios) || [],
        termosUsoAceitoEm: new Date(),
        termosUsoVersao: TERMOS_USO_VERSAO_ATUAL,
        politicaPrivacidadeAceitaEm: new Date(),
        politicaPrivacidadeVersao: POLITICA_PRIVACIDADE_VERSAO_ATUAL,
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

      if (!empresa.slug) {
        empresa.slug = await gerarSlugUnicoEmpresa(empresa.nome, empresa._id);
        await empresa.save();
      }

      const vagas = await Vaga.find({ empresa: empresa._id });
      const vagasIds = vagas.map((vaga) => vaga._id);
      const candidaturas = vagasIds.length
        ? await Candidatura.find({ vaga: { $in: vagasIds } })
            .sort({ createdAt: -1 })
            .populate('candidato', 'nome qualificacao imagem')
        : [];

      const candidatosVinculados = [];
      const candidatosIds = new Set();

      for (const candidatura of candidaturas) {
        const candidato = candidatura.candidato;
        const candidatoId = candidato?._id?.toString();

        if (candidatoId && !candidatosIds.has(candidatoId)) {
          candidatosIds.add(candidatoId);
          candidatosVinculados.push(toCandidatoResumoDTO(candidato));
        }
      }

      res.status(200).json({
        empresa: toEmpresaDTO(empresa),
        vagas: vagas.map(toVagaDTO),
        candidatosRecentes: candidatosVinculados.slice(0, 3),
        totalCandidatos: candidatosIds.size,
      });
    } catch (erro) {
      console.error('Erro no Dashboard Empresa:', erro);
      next(erro);
    }
  }

  static async editarPerfil(req, res, next) {
    try {
      const empresaId = req.session.user.id;
      const {
        nome,
        email,
        fone,
        bio,
        site,
        segmento,
        localizacao,
        tamanhoEmpresa,
        anoFundacao,
        missao,
        valores,
        beneficios,
      } = req.body;

      const empresa = await Empresa.findById(empresaId);
      if (!empresa) {
        return next(new Error404('Empresa não encontrada.'));
      }

      if (nome !== undefined) {
        empresa.nome = nome;
        empresa.slug = await gerarSlugUnicoEmpresa(nome, empresa._id);
      } else if (!empresa.slug) {
        empresa.slug = await gerarSlugUnicoEmpresa(empresa.nome, empresa._id);
      }

      if (email !== undefined) empresa.email = email;
      if (fone !== undefined) empresa.fone = fone;
      if (bio !== undefined) empresa.bio = bio;
      if (site !== undefined) empresa.site = site;
      if (segmento !== undefined) empresa.segmento = segmento;
      if (localizacao !== undefined) empresa.localizacao = localizacao;
      if (tamanhoEmpresa !== undefined) empresa.tamanhoEmpresa = tamanhoEmpresa;
      if (anoFundacao !== undefined) empresa.anoFundacao = normalizeAnoFundacao(anoFundacao);
      if (missao !== undefined) empresa.missao = missao;
      if (valores !== undefined) empresa.valores = normalizeListField(valores);
      if (beneficios !== undefined) empresa.beneficios = normalizeListField(beneficios);

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

  static async buscarPerfilPublico(req, res, next) {
    try {
      const { slug } = req.params;

      if (!slug || slug.length > 120) {
        return next(new Error400('Perfil de empresa inválido.'));
      }

      const empresa = await Empresa.findOne({ slug });

      if (!empresa) {
        return next(new Error404('Empresa não encontrada.'));
      }

      const vagas = await Vaga.find({
        empresa: empresa._id,
        ...publicOpenVagaStatusFilter,
      }).sort({ createdAt: -1 });

      res.status(200).json({
        empresa: toEmpresaPublicProfileDTO(empresa),
        vagas: vagas.map(toVagaDTO),
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async listarPerfisPublicos(req, res, next) {
    try {
      const empresas = await Empresa.find({}).sort({ nome: 1 }).limit(60);

      for (const empresa of empresas) {
        if (!empresa.slug) {
          empresa.slug = await gerarSlugUnicoEmpresa(empresa.nome, empresa._id);
          await empresa.save();
        }
      }

      res.status(200).json({
        empresas: empresas.map(toEmpresaPublicProfileDTO),
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
        if (!isAllowedVagaImageMetadata(req.file) || !isAllowedVagaImageContent(req.file)) {
          return next(
            new Error400('Formato de arquivo inválido. Apenas SVG, PNG ou JPG são permitidos.')
          );
        }

        if (req.file.size > 10 * 1024 * 1024) {
          return next(new Error400('A imagem excede o limite máximo de 10MB.'));
        }

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

  static async excluirConta(req, res, next) {
    try {
      const empresaId = req.session.user.id;

      const empresa = await Empresa.findById(empresaId);
      if (!empresa) {
        return next(new Error404('Empresa não encontrada.'));
      }

      const erroSenha = await validarSenhaDeConfirmacao(req.body?.senha, empresa.senha);
      if (erroSenha) {
        return next(erroSenha);
      }

      const vagasIds = await Vaga.distinct('_id', { empresa: empresa._id });
      await Candidatura.deleteMany({
        $or: [{ vaga: { $in: vagasIds } }, { empresa: empresa._id }],
      });
      await Vaga.deleteMany({ empresa: empresa._id });
      await Empresa.deleteOne({ _id: empresa._id });

      await encerrarSessao(req, res);
      res.status(200).json({ success: true, message: 'Conta excluída com sucesso' });
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
        .populate(
          'candidato',
          'nome email telefone educacao qualificacao cursos descricao habilidadesTecnicas idiomas imagem'
        )
        .populate('vaga', 'nome');
      res.status(200).json({
        candidaturas: candidaturas.map(toCandidaturaEmpresaDTO),
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
      const { q, vagaId } = req.query;
      const candidatos = await buscarCandidatos(req.session.user.id, { q, vagaId });

      res.status(200).json({ candidatos });
    } catch (erro) {
      if (!erro.status) console.error(erro);
      next(erro);
    }
  }

  static async listarCandidatosFavoritos(req, res, next) {
    try {
      const candidatos = await listarFavoritos(req.session.user.id);

      res.status(200).json({ candidatos });
    } catch (erro) {
      if (!erro.status) console.error(erro);
      next(erro);
    }
  }

  static async favoritarCandidato(req, res, next) {
    try {
      const candidato = await favoritar(req.session.user.id, req.params.candidatoId);

      res.status(200).json({
        success: true,
        message: 'Candidato adicionado aos favoritos.',
        candidato,
      });
    } catch (erro) {
      if (!erro.status) console.error(erro);
      next(erro);
    }
  }

  static async desfavoritarCandidato(req, res, next) {
    try {
      const { candidatoId } = req.params;
      await desfavoritar(req.session.user.id, candidatoId);

      res.status(200).json({
        success: true,
        message: 'Candidato removido dos favoritos.',
        candidatoId,
        favoritado: false,
      });
    } catch (erro) {
      if (!erro.status) console.error(erro);
      next(erro);
    }
  }
}

export default EmpresaController;
