const Candidato = require('../models/candidatoModel');
const Empresa = require('../models/empresaModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Realiza login e inicia sessão do usuário
exports.realizarLogin = async (req, res) => {
    const {
        email,
        senha
    } = req.body;
    try {
        const user = await Candidato.findOne({
            email: req.body.email
        }) || await Empresa.findOne({
            email: req.body.email
        });

        // Verifica se o candidato existe
        if (!user) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        // Verifica se as senhas estão certas
        const isValidPassword = await bcrypt.compare(senha, user.senha);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'E-mail ou senha inválidos.'
            });
        }

        const userType = user.constructor.modelName.toLowerCase();

        req.session.user = {
            id: user._id,
            role: userType
        };

        return res.json({
            message: 'Login bem-sucedido',
            redirectUrl: userType === 'candidato' ? '/candidato/dashboard' : '/empresa/dashboard',
        });
    } catch (erro) {
        console.error(erro);
        // Se a requisição for AJAX, o render vai retornar HTML para o JS que espera JSON.
        // Mas conforme a task pede para substituir JSON de erro por página, segue a implementação:
        res.status(500).render('paginaErro', {
            title: 'Falha no Login',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao processar o login. Tente novamente!'
        });
    }
};

// Envia o email de recuperação de senha
exports.recuperarSenha = async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASS
            }
        })

        const user = await Candidato.findOne({
            email: req.body.email
        }) || await Empresa.findOne({
            email: req.body.email
        });

        // Verifica se o usuário existe
        if (!user) {
            // Transformando em página de erro para manter consistência visual
             return res.status(404).render('paginaErro', {
                title: 'E-mail não encontrado',
                style: 'paginaErro.css',
                status: 404,
                erro: 'User Not Found',
                mensagem: 'O e-mail informado não consta em nossa base de dados.'
            });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiration = Date.now() + 15 * 60 * 1000;

        user.resetToken = token;
        user.resetTokenExpiration = tokenExpiration;
        await user.save();

        const linkReset = `http://${req.headers.host}/redefinir_senha/${token}`;

        const mailOptions = {
            from: process.env.APP_EMAIL,
            to: req.body.email,
            subject: 'Recuperar senha - App JobFinder',
            html: `
            <h1>Recuperar Senha</h1>
            <p>Para recuperar sua senha, acesse o link abaixo:</p>
            <a href="${linkReset}">${linkReset}</a>
            <p>Este link expira em 15 minutos.</p>
            <p>Se você não solicitou isso, ignore este e-mail.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.redirect('/login');
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Recuperação',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao tentar enviar o e-mail de recuperação. Tente novamente!'
        });
    }
}

// Altera a senha atual
exports.redefinirSenha = async (req, res) => {
    try {
        const token = req.params.token;

        const user =
            (await Candidato.findOne({
                resetToken: token,
                resetTokenExpiration: {
                    $gt: Date.now()
                },
            })) ||
            (await Empresa.findOne({
                resetToken: token,
                resetTokenExpiration: {
                    $gt: Date.now()
                },
            }));

        // Verifica se o usuário existe
        if (!user) {
             return res.status(404).render('paginaErro', {
                title: 'Token Inválido',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Invalid Token',
                mensagem: 'O token de redefinição é inválido ou expirou.'
            });
        }

        const salt = await bcrypt.genSalt(12)
        user.senha = await bcrypt.hash(req.body.senha, salt);
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.redirect('/login');
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Redefinição',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao redefinir a senha. Tente novamente!'
        });
    }
}

// Realiza o logout finalizando a sessão do usuário
exports.logout = (req, res) => {
    req.session.destroy((erro) => {
        if (erro) {
             res.status(500).render('paginaErro', {
                title: 'Erro no Logout',
                style: 'paginaErro.css',
                status: 500,
                erro: erro.message || erro,
                mensagem: 'Erro ao finalizar a sessão. Tente novamente!'
            });
        }
    })
    res.redirect('/login');
}