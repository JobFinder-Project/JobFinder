import bcrypt from 'bcrypt';
import Candidato from '../models/candidatoModel.js';
import Vaga from '../models/vagasModel.js';
import Candidatura from '../models/candidaturaModel.js';

class CandidatoController {
  static async cadastrarCandidato(req, res) {
    try {
      const { email, senha } = req.body;
      const userExiste = (await Candidato.findOne({ email })) || (await Empresa.findOne({ email }));

      if (userExiste) {
        return res.status(422).json({ error: 'Email já utilizado no sistema' });
      }

      if (!senha || typeof senha !== 'string') {
        return res.status(400).json({ error: 'A senha é obrigatória e deve ser texto.' });
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
      res.json({ success: true, message: 'Cadastro realizado com sucesso' });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao cadastrar candidato' });
    }
  }

  static async acessarDashboard(req, res) {
    try {
      const candidatoId = req.session.user.id;
      const vagas = await Vaga.find().populate('empresa');
      const candidato = await Candidato.findById(candidatoId, '-senha');

      if (!candidato) {
        return res.status(404).json({ error: 'Candidato não encontrado' });
      }

      const vagasComImagens = vagas.map((vaga) => {
        let imagemBase64 = null;
        if (vaga.imagem && vaga.imagem.data) {
          imagemBase64 = `data:${vaga.imagem.contentType};base64,${vaga.imagem.data.toString('base64')}`;
        }
        return { ...vaga._doc, imagem: imagemBase64 };
      });

      const areas = [...new Set(vagas.map((vaga) => vaga.area))];

      let candidatoFormatado = candidato.toObject();
      if (candidato.imagem && candidato.imagem.data) {
        candidatoFormatado.imagem = {
          contentType: candidato.imagem.contentType,
          data: candidato.imagem.data.toString('base64'),
        };
      }

      res.json({
        candidatoId,
        candidato: candidatoFormatado,
        vagas: vagasComImagens,
        areas,
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
  }

  static async editarPerfil(req, res) {
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
        return res.status(404).json({ error: 'Candidato não encontrado' });
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

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso',
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  static async realizarCandidatura(req, res) {
    try {
      const candidatoId = req.session.user.id;
      const vagaId = req.params.vagaId;

      const candidaturaExistente = await Candidatura.findOne({
        candidato: candidatoId,
        vaga: vagaId,
      });

      if (candidaturaExistente) {
        return res.status(400).json({ error: 'Você já se candidatou a esta vaga' });
      }

      const vaga = await Vaga.findById(vagaId);
      if (!vaga) {
        return res.status(404).json({ error: 'Vaga não encontrada' });
      }

      const novaCandidatura = new Candidatura({
        candidato: candidatoId,
        vaga: vagaId,
        empresa: vaga.empresa,
        status: 'Pendente',
      });

      await novaCandidatura.save();
      res.json({ success: true, message: 'Candidatura realizada com sucesso' });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao realizar candidatura' });
    }
  }

  static async listarCandidaturas(req, res) {
    try {
      const candidatoId = req.session.user.id;
      const candidaturas = await Candidatura.find({
        candidato: candidatoId,
      }).populate({
        path: 'vaga',
        populate: { path: 'empresa' },
      });

      const candidaturasFormatadas = candidaturas.map((c) => ({
        ...c._doc,
        vaga: c.vaga
          ? {
              ...c.vaga._doc,
              imagem: c.vaga.imagem?.data
                ? `data:${c.vaga.imagem.contentType};base64,${c.vaga.imagem.data.toString('base64')}`
                : null,
            }
          : null,
      }));

      res.json({ candidaturas: candidaturasFormatadas });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao carregar candidaturas' });
    }
  }

  static async deletarCandidatura(req, res) {
    try {
      const { candidaturaId } = req.params;
      await Candidatura.findByIdAndDelete(candidaturaId);
      res.json({ success: true, message: 'Candidatura deletada com sucesso' });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao deletar candidatura' });
    }
  }
}

export default CandidatoController;
