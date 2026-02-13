import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import Candidato from '../models/Candidato.js';
import Empresa from '../models/Empresa.js';

class AuthController {
  static async login(req, res) {
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
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      const senhaValida = await bcrypt.compare(senha, user.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      req.session.user = {
        id: user._id,
        nome: user.nome,
        email: user.email,
        role: role,
      };

      const redirectUrl = role === 'candidato' ? '/candidato/dashboard' : '/empresa/dashboard';

      res.json({
        message: 'Login bem-sucedido',
        user: req.session.user,
        redirectUrl,
      });
    } catch (erro) {
      console.error('Erro no login:', erro);
      res.status(500).json({ error: 'Erro no servidor ao realizar login' });
    }
  }

  static async getMe(req, res) {
    try {
      if (req.session && req.session.user) {
        return res.json({
          authenticated: true,
          user: req.session.user,
        });
      }
      return res.json({ authenticated: false });
    } catch (error) {
      console.error('Erro na rota /me:', error);
      return res.json({ authenticated: false });
    }
  }

  static async logout(req, res) {
    req.session.destroy((erro) => {
      if (erro) {
        return res.status(500).json({ error: 'Erro ao finalizar sessão' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logout realizado com sucesso' });
    });
  }

  static async enviarRecuperarSenha(req, res) {
    try {
      const user =
        (await Candidato.findOne({ email: req.body.email })) ||
        (await Empresa.findOne({ email: req.body.email }));

      if (!user) {
        return res.status(404).json({
          error: 'O e-mail informado não consta em nossa base de dados.',
        });
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

      const linkReset = `${req.protocol}://${process.env.HOST_FRONTEND}/redefinir-senha/${token}`;

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

      res.json({
        success: true,
        message: 'E-mail de recuperação enviado com sucesso!',
      });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({
        error: 'Erro ao tentar enviar o e-mail de recuperação. Tente novamente!',
      });
    }
  }

  static async redefinirSenha(req, res) {
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
        return res.status(404).json({ error: 'O token de redefinição é inválido ou expirou.' });
      }

      const salt = await bcrypt.genSalt(12);
      user.senha = await bcrypt.hash(req.body.senha, salt);
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      await user.save();

      res.json({ success: true, message: 'Senha redefinida com sucesso!' });
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ error: 'Erro ao redefinir a senha. Tente novamente!' });
    }
  }
}

export default AuthController;
