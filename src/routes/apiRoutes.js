const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const Candidato = require('../models/candidatoModel');
const Empresa = require('../models/empresaModel');
const Vaga = require('../models/vagasModel');
const Candidatura = require('../models/candidaturaModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const isAuthenticatedApi = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).json({ error: 'Não autenticado. Faça login.' });
};

const isCandidatoApi = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'candidato') {
        return next();
    }
    return res.status(403).json({ error: 'Acesso negado. Apenas candidatos.' });
};

const isEmpresaApi = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'empresa') {
        return next();
    }
    return res.status(403).json({ error: 'Acesso negado. Apenas empresas.' });
};


router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await Candidato.findOne({ email }) || await Empresa.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        const isValidPassword = await bcrypt.compare(senha, user.senha);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
        }

        const userType = user.constructor.modelName.toLowerCase();

        req.session.user = {
            id: user._id,
            role: userType
        };

        res.json({
            success: true,
            message: 'Login bem-sucedido',
            redirectUrl: userType === 'candidato' ? '/candidato/dashboard' : '/empresa/dashboard',
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao processar o login. Tente novamente!' });
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy((erro) => {
        if (erro) {
            return res.status(500).json({ error: 'Erro ao finalizar sessão' });
        }
        res.json({ success: true, message: 'Logout realizado com sucesso' });
    });
});


router.post('/recuperar_senha', async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASS
            }
        });

        const user = await Candidato.findOne({ email: req.body.email }) || 
                     await Empresa.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ error: 'O e-mail informado não consta em nossa base de dados.' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiration = Date.now() + 15 * 60 * 1000;

        user.resetToken = token;
        user.resetTokenExpiration = tokenExpiration;
        await user.save();

        const linkReset = `${req.protocol}://${req.headers.host}/redefinir-senha/${token}`;

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

        res.json({ success: true, message: 'E-mail de recuperação enviado com sucesso!' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao tentar enviar o e-mail de recuperação. Tente novamente!' });
    }
});

router.post('/redefinir_senha/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await Candidato.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        }) || await Empresa.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });

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
});


router.get('/candidato/dashboard', isAuthenticatedApi, isCandidatoApi, async (req, res) => {
    try {
        const candidatoId = req.session.user.id;
        const vagas = await Vaga.find().populate('empresa');
        const candidato = await Candidato.findById(candidatoId, '-senha');

        if (!candidato) {
            return res.status(404).json({ error: 'Candidato não encontrado' });
        }

        const vagasComImagens = vagas.map(vaga => {
            let imagemBase64 = null;
            if (vaga.imagem && vaga.imagem.data) {
                imagemBase64 = `data:${vaga.imagem.contentType};base64,${vaga.imagem.data.toString('base64')}`;
            }
            return {
                ...vaga._doc,
                imagem: imagemBase64,
            };
        });

        const areas = [...new Set(vagas.map(vaga => vaga.area))];

        let candidatoFormatado = candidato.toObject();
        if (candidato.imagem && candidato.imagem.data) {
            candidatoFormatado.imagem = {
                contentType: candidato.imagem.contentType,
                data: candidato.imagem.data.toString('base64')
            };
        }

        res.json({
            candidatoId,
            candidato: candidatoFormatado,
            vagas: vagasComImagens,
            areas
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
});


router.get('/candidato/candidaturas', isAuthenticatedApi, isCandidatoApi, async (req, res) => {
    try {
        const candidatoId = req.session.user.id;
        const candidaturas = await Candidatura.find({ candidato: candidatoId })
            .populate({
                path: 'vaga',
                populate: { path: 'empresa' }
            });

        const candidaturasFormatadas = candidaturas.map(c => ({
            ...c._doc,
            vaga: c.vaga ? {
                ...c.vaga._doc,
                imagem: c.vaga.imagem?.data 
                    ? `data:${c.vaga.imagem.contentType};base64,${c.vaga.imagem.data.toString('base64')}`
                    : null
            } : null
        }));

        res.json({ candidaturas: candidaturasFormatadas });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao carregar candidaturas' });
    }
});


router.post('/candidato/cadastrar', upload.single('imagem'), async (req, res) => {
    try {
        const userExiste = await Candidato.findOne({ email: req.body.email });

        if (userExiste) {
            return res.status(422).json({ error: 'Email já utilizado no sistema' });
        }

        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(req.body.senha, salt);

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
            imagem: req.file ? {
                data: req.file.buffer,
                contentType: req.file.mimetype
            } : undefined
        });

        await novoCandidato.save();
        res.json({ success: true, message: 'Cadastro realizado com sucesso' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao cadastrar candidato' });
    }
});


router.post('/candidato/:candidatoId/vagas/:vagaId', isAuthenticatedApi, isCandidatoApi, async (req, res) => {
    try {
        const { candidatoId, vagaId } = req.params;

        const candidaturaExistente = await Candidatura.findOne({
            candidato: candidatoId,
            vaga: vagaId
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
            status: 'Pendente'
        });

        await novaCandidatura.save();
        res.json({ success: true, message: 'Candidatura realizada com sucesso' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao candidatar' });
    }
});


router.post('/candidato/:candidatoId/vagas/delete/:candidaturaId', isAuthenticatedApi, isCandidatoApi, async (req, res) => {
    try {
        const { candidaturaId } = req.params;
        await Candidatura.findByIdAndDelete(candidaturaId);
        res.json({ success: true, message: 'Candidatura cancelada' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao cancelar candidatura' });
    }
});


router.post('/candidato/:candidatoId/editar', isAuthenticatedApi, isCandidatoApi, upload.single('imagem'), async (req, res) => {
    try {
        const { candidatoId } = req.params;
        const { nome, cpf, email, telefone, educacao, qualificacao, cursos, descricao, habilidadesTecnicas, idiomas } = req.body;

        const candidato = await Candidato.findById(candidatoId);
        if (!candidato) {
            return res.status(404).json({ error: 'Candidato não encontrado' });
        }

        
        if (nome !== undefined) candidato.nome = nome;
        if (cpf !== undefined) candidato.cpf = cpf;
        if (email !== undefined) candidato.email = email;
        if (telefone !== undefined) candidato.telefone = telefone;
        if (educacao !== undefined) candidato.educacao = educacao;
        if (qualificacao !== undefined) candidato.qualificacao = qualificacao;
        if (cursos !== undefined) {
            candidato.cursos = typeof cursos === 'string' 
                ? cursos.split(',').map(c => c.trim()).filter(c => c) 
                : cursos;
        }
        if (descricao !== undefined) candidato.descricao = descricao;
        if (habilidadesTecnicas !== undefined) candidato.habilidadesTecnicas = habilidadesTecnicas;
        if (idiomas !== undefined) {
            candidato.idiomas = typeof idiomas === 'string' 
                ? idiomas.split(',').map(i => i.trim()).filter(i => i) 
                : idiomas;
        }

        
        if (req.file) {
            candidato.imagem = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        await candidato.save();

        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
});


router.get('/empresa/dashboard', isAuthenticatedApi, isEmpresaApi, async (req, res) => {
    try {
        const empresaId = req.session.user.id;
        const empresa = await Empresa.findById(empresaId, '-senha').populate('vagas');

        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        const candidatos = await Candidato.find({}, '-senha');

        
        const candidatosComImagens = candidatos.map(c => {
            let imagemBase64 = null;
            if (c.imagem && c.imagem.data) {
                imagemBase64 = `data:${c.imagem.contentType};base64,${c.imagem.data.toString('base64')}`;
            }
            return { ...c._doc, imagem: imagemBase64 };
        });

        
        const vagasComImagens = empresa.vagas ? empresa.vagas.map(v => {
            let imagemBase64 = null;
            if (v.imagem && v.imagem.data) {
                imagemBase64 = `data:${v.imagem.contentType};base64,${v.imagem.data.toString('base64')}`;
            }
            return { ...v._doc, imagem: imagemBase64 };
        }) : [];

        res.json({
            user: { ...empresa._doc, _id: empresaId },
            empresaId,
            candidatos: candidatosComImagens,
            vagas: vagasComImagens
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
});


router.get('/empresa/perfil', isAuthenticatedApi, isEmpresaApi, async (req, res) => {
    try {
        const empresaId = req.session.user.id;
        const empresa = await Empresa.findById(empresaId, '-senha');

        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        res.json({ empresa });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao carregar perfil' });
    }
});


router.post('/empresa/cadastrar', async (req, res) => {
    try {
        const empresaExistente = await Empresa.findOne({ cnpj: req.body.cnpj });

        if (empresaExistente) {
            return res.status(409).json({ error: 'Empresa já cadastrada' });
        }

        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(req.body.senha, salt);

        const novaEmpresa = new Empresa({
            nome: req.body.nome,
            email: req.body.email,
            cnpj: req.body.cnpj,
            senha: senhaHash,
            fone: req.body.fone,
            bio: req.body.bio || '',
            site: req.body.site || ''
        });

        await novaEmpresa.save();
        res.json({ success: true, message: 'Empresa cadastrada com sucesso' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao cadastrar empresa' });
    }
});


router.post('/empresa/:empresaId/editar', isAuthenticatedApi, isEmpresaApi, async (req, res) => {
    try {
        const { empresaId } = req.params;
        const { nome, cnpj, email, fone, bio, site } = req.body;

        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        
        if (nome !== undefined) empresa.nome = nome;
        if (cnpj !== undefined) empresa.cnpj = cnpj.replace(/\D/g, '');
        if (email !== undefined) empresa.email = email;
        if (fone !== undefined) empresa.fone = fone.replace(/\D/g, '');
        if (bio !== undefined) empresa.bio = bio;
        if (site !== undefined) empresa.site = site;

        await empresa.save();

        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso',
            empresa: {
                _id: empresa._id,
                nome: empresa.nome,
                cnpj: empresa.cnpj,
                email: empresa.email,
                fone: empresa.fone,
                bio: empresa.bio,
                site: empresa.site
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
});


router.post('/empresa/:empresaId/vagas/criar', isAuthenticatedApi, isEmpresaApi, upload.single('imagem'), async (req, res) => {
    try {
        const { empresaId } = req.params;
        const { nome, area, requisitos } = req.body;

        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa não encontrada' });
        }

        const dadosVaga = {
            nome,
            area,
            requisitos,
            empresa: empresa._id
        };

        if (req.file) {
            dadosVaga.imagem = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        const novaVaga = new Vaga(dadosVaga);
        await novaVaga.save();

        empresa.vagas.push(novaVaga._id);
        await empresa.save();

        res.json({ success: true, message: 'Vaga criada com sucesso', vaga: novaVaga });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao criar vaga' });
    }
});


router.get('/empresa/candidatos/buscar', isAuthenticatedApi, isEmpresaApi, async (req, res) => {
    try {
        const { q } = req.query;

        const candidatos = await Candidato.find({
            $or: [
                { qualificacao: { $regex: q || '', $options: 'i' } },
                { educacao: { $regex: q || '', $options: 'i' } },
                { nome: { $regex: q || '', $options: 'i' } }
            ]
        }, '-senha');

        const candidatosComImagens = candidatos.map(c => {
            let imagemBase64 = null;
            if (c.imagem && c.imagem.data) {
                imagemBase64 = `data:${c.imagem.contentType};base64,${c.imagem.data.toString('base64')}`;
            }
            return { ...c._doc, imagem: imagemBase64 };
        });

        res.json({ candidatos: candidatosComImagens, query: q });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao buscar candidatos' });
    }
});


router.get('/vagas', async (req, res) => {
    try {
        const { q, area } = req.query;
        let query = {};

        if (q) {
            query.$or = [
                { nome: { $regex: q, $options: 'i' } },
                { area: { $regex: q, $options: 'i' } }
            ];
        }

        if (area) {
            query.area = area;
        }

        const vagas = await Vaga.find(query).populate('empresa');

        const vagasFormatadas = vagas.map(v => {
            let imagemBase64 = null;
            if (v.imagem && v.imagem.data) {
                imagemBase64 = `data:${v.imagem.contentType};base64,${v.imagem.data.toString('base64')}`;
            }
            return { ...v._doc, imagem: imagemBase64 };
        });

        res.json({ vagas: vagasFormatadas });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao buscar vagas' });
    }
});


router.get('/areas', async (req, res) => {
    try {
        const vagas = await Vaga.find({}, 'area');
        const areas = [...new Set(vagas.map(v => v.area))];
        res.json(areas);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: 'Erro ao buscar áreas' });
    }
});

module.exports = router;
