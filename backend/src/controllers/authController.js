import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Candidato from '../models/candidatoModel.js';
import Empresa from '../models/empresaModel.js';
import Error400 from '../errors/Error400.js';
import Error404 from '../errors/Error404.js';
import { toLoginResponseDTO, toAuthUserDTO } from '../dtos/index.js';

class AuthController {
  static async login(req, res, next) {
    const { email, senha } = req.body;

    try {
      let user = await Candidato.findOne({ email });
      let role = null;

      if (user) {
        role = 'candidato';
      } else {
        user = await Empresa.findOne({ email });
        if (user) {
          role = 'empresa';
        }
      }

      if (!user) {
        return next(new Error400('Email ou senha incorretos'));
      }

      const senhaValida = await bcrypt.compare(senha, user.senha);
      if (!senhaValida) {
        return next(new Error400('Email ou senha incorretos'));
      }

      req.session.user = {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: role,
      };

      res.status(200).json(toLoginResponseDTO({ user, role }));
    } catch (erro) {
      console.error('Erro no login:', erro);
      next(erro);
    }
  }

  static async getMe(req, res, next) {
    try {
      if (req.session && req.session.user) {
        return res.status(200).json({
          authenticated: true,
          user: toAuthUserDTO(req.session.user),
        });
      }
      return res.status(200).json({ authenticated: false });
    } catch (error) {
      console.error('Erro na rota /me:', error);
      next(error);
    }
  }

  static async logout(req, res, next) {
    req.session.destroy((erro) => {
      if (erro) {
        return next(erro);
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ success: true, message: 'Logout realizado com sucesso' });
    });
  }

  static async enviarRecuperarSenha(req, res, next) {
    try {
      const user =
        (await Candidato.findOne({ email: req.body.email })) ||
        (await Empresa.findOne({ email: req.body.email }));

      if (!user) {
        return next(new Error404('O e-mail informado não consta em nossa base de dados.'));
      }

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASS,
        },
      });

      const token = crypto.randomBytes(20).toString('hex');
      const tokenExpiration = Date.now() + 15 * 60 * 1000;

      user.resetToken = token;
      user.resetTokenExpiration = tokenExpiration;
      await user.save();

      const frontendUrl = req.get('origin') || `${req.protocol}://${req.get('host')}`;
      const linkReset = `${frontendUrl.replace(/\/$/, '')}/redefinir-senha/${token}`;

      const mailOptions = {
        from: process.env.APP_EMAIL,
        to: req.body.email,
        subject: 'Recuperar senha - App JobFinder',
        html: `
                <h1>Recuperar Senha</h1>
                <p>Para recuperar sua senha, acesse o link abaixo:</p>
                <a href='${linkReset}'>${linkReset}</a>
                <p>Este link expira em 15 minutos.</p>
                <p>Se você não solicitou isso, ignore este e-mail.</p>
                `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: 'E-mail de recuperação enviado com sucesso!',
      });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }

  static async redefinirSenha(req, res, next) {
    try {
      const { token } = req.params;

      const user =
        (await Candidato.findOne({
          resetToken: token,
          resetTokenExpiration: { $gt: Date.now() },
        })) ||
        (await Empresa.findOne({
          resetToken: token,
          resetTokenExpiration: { $gt: Date.now() },
        }));

      if (!user) {
        return next(new Error404('O token de redefinição é inválido ou expirou.'));
      }

      const salt = await bcrypt.genSalt(12);
      user.senha = await bcrypt.hash(req.body.senha, salt);
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();

      res.status(200).json({ success: true, message: 'Senha redefinida com sucesso!' });
    } catch (erro) {
      console.error(erro);
      next(erro);
    }
  }
}

export default AuthController;
