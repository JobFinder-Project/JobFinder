import bcrypt from 'bcrypt';
import Candidato from '../models/candidatoModel.js';
import Empresa from '../models/empresaModel.js';
import Vaga from '../models/vagasModel.js';
import Error400 from '../errors/Error400.js';
import Error404 from '../errors/Error404.js';

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

      const vagasFormatadas = vagas.map((v) => {
        let imagemBase64 = null;
        if (v.imagem && v.imagem.data) {
          imagemBase64 = `data:${v.imagem.contentType};base64,${v.imagem.data.toString('base64')}`;
        }
        return { ...v._doc, imagem: imagemBase64 };
      });

      let empresaFormatada = { ...empresa._doc };
      if (empresa.imagem && empresa.imagem.data) {
        empresaFormatada.imagem = `data:${empresa.imagem.contentType};base64,${empresa.imagem.data.toString('base64')}`;
      }

      res.status(200).json({ empresa: empresaFormatada, vagas: vagasFormatadas });
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
      if (fone !== undefined) empresa.fone = fone.replace(/\D/g, '');
      if (bio !== undefined) empresa.bio = bio;
      if (site !== undefined) empresa.site = site;

      await empresa.save();

      res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        empresa: {
          _id: empresa._id,
          nome: empresa.nome,
          email: empresa.email,
          fone: empresa.fone,
          bio: empresa.bio,
          site: empresa.site,
        },
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
        vaga: novaVaga,
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

      const candidatosComImagens = candidatos.map((c) => {
        let imagemBase64 = null;
        if (c.imagem && c.imagem.data) {
          imagemBase64 = `data:${c.imagem.contentType};base64,${c.imagem.data.toString('base64')}`;
        }
        return { ...c._doc, imagem: imagemBase64 };
      });

      res.status(200).json({ candidatos: candidatosComImagens, query: q });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }
}

export default EmpresaController;
