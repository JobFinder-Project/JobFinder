const Candidato = require('../models/candidatoModel.js');
const Vaga = require('../models/vagasModel.js');
const Empresa = require('../models/empresaModel.js');
const Candidatura = require('../models/candidaturaModel.js');
const bcrypt = require('bcrypt');
const {
    isAuthenticated
} = require('../middleware/auth.js');
const Swal = require('sweetalert2')

function toggleMenu() {
    const sideMenu = document.getElementById('side-menu');
    if (sideMenu.classList.contains('hidden')) {
        sideMenu.classList.remove('hidden');
        sideMenu.classList.add('visible');
    } else {
        sideMenu.classList.remove('visible');
        sideMenu.classList.add('hidden');
    }
}

// Renderiza a página de dashboard
const dashboardCandidato = async (req, res) => {
    try {
        const candidatoId = req.session.user.id;
        const vagas = await Vaga.find().populate('empresa');

        // Converte as imagens para base64
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

        res.render('can/candidatoDashboard', {
            title: 'Dashboard',
            user: req.session.user,
            message: 'Bem-vindo ao seu painel, Candidato!',
            style: 'candidatoDashboar.css',
            candidatoId,
            vagas: vagasComImagens,
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao renderizar a página dashboard do candidato!",
            error: erro.message
        });
    }
};

// Renderiza a página de cadastro de perfil
const getCadastroCandidato = async (req, res) => {
    try {
        res.render('can/reg_candidato', {
            title: 'Registro de Candidato',
            style: 'reg_candidato.css'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao renderizar a página de registro do candidato!",
            error: erro.message
        });
    }
};

// Renderiza a página do perfil
const getPerfilCandidato = async (req, res) => {
    try {
        const id = req.params.candidatoId;
        const candidato = await Candidato.findById(id, '-senha');

        // Verifica se o candidato existe
        if (!candidato) {
            return res.status(404).send("Candidato não encontrado");
        }

        res.render('can/getPerfil', {
            title: candidato.nome,
            style: "getPerfilCand.css",
            user: candidato,
            id: candidato._id,
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao renderizar o perfil do candidato!",
            error: erro.message
        });
    }
};

// Salva um novo Candidato no banco de dados (JSON + validações detalhadas)
const cadastrarCandidato = async (req, res) => {
    try {
        const existente = await Candidato.findOne({ email: req.body.email });
        if (existente) {
            return res.status(422).json({ error: 'E-mail já cadastrado. Escolha outro.' });
        }

        const salt = await bcrypt.genSalt(12);
        const senhaHash = await bcrypt.hash(req.body.senha, salt);

        const candidato = new Candidato({
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
            imagem: req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : undefined
        });

        await candidato.save();
        return res.status(201).json({ message: 'Cadastro realizado com sucesso!', id: candidato._id });
    } catch (erro) {
        console.error(erro);
        if (erro.name === 'ValidationError') {
            const msgs = Object.values(erro.errors).map(e => e.message); 
            return res.status(400).json({ error: msgs.join(' | ') });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar o candidato.' });
    }
};

// Renderiza a página de detalhes de uma vaga
const verVaga = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const candidatoId = req.session.user.id;
        const vaga = await Vaga.findById(id).populate('empresa');

        // Verifica se a vaga foi encontrada
        if (!vaga) {
            return res.status(404).send({
                message: 'Vaga não encontrada!'
            });
        }

        // Converte a imagem em Base64 (se existir)
        let imagemBase64 = null;
        if (vaga.imagem && vaga.imagem.data) {
            imagemBase64 = `data:${vaga.imagem.contentType};base64,${vaga.imagem.data.toString('base64')}`;
        }

        res.render('can/vagaDetalhes', {
            title: vaga.nome,
            _id: vaga._id,
            nome: vaga.nome,
            area: vaga.area,
            requisitos: vaga.requisitos,
            empresa: vaga.empresa.nome,
            imagem: imagemBase64,
            style: 'vagasDetalhes.css',
            candidatoId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao renderizar a página da vaga!',
            error: erro.message
        });
    }
};

// Renderiza a página da lista de vagas existentes
const buscarVagas = async (req, res) => {
    try {
        const {
            q
        } = req.query;

        const vagas = await Vaga.find({
            $or: [{
                    nome: {
                        $regex: q,
                        $options: 'i'
                    }
                },
                {
                    area: {
                        $regex: q,
                        $options: 'i'
                    }
                }
            ]
        }).populate('empresa');

        // Converte as imagens para Base64
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

        res.render('can/resultVagas', {
            vagas: vagasComImagens,
            query: q,
            title: 'Lista de Vagas',
            style: 'buscaVagas.css'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao buscar as vagas!',
            error: erro.message
        });
    }
};

// Realiza uma candidatura a vaga escolhida
const candidatarAVaga = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const candidatoId = req.session.user.id

        // Valida se o ID do candidato existe na sessão
        if (!candidatoId) {
            return res.status(400).send({
                message: 'Usuário não autenticado!'
            });
        }

        // Busca a vaga pelo ID e popula os dados da empresa associada
        const vaga = await Vaga.findById(id).populate('empresa');
        if (!vaga) {
            return res.status(404).send({
                message: 'Vaga não encontrada!'
            });
        }

        // Busca o candidato pelo ID
        const candidato = await Candidato.findById(candidatoId);
        if (!candidato) {
            return res.status(404).send({
                message: 'Candidato não encontrado!'
            });
        }

        // Verifica se já existe uma candidatura para essa vaga
        const candidaturaExistente = await Candidatura.findOne({
            candidato: candidato._id,
            vaga: vaga._id
        });
        if (candidaturaExistente) {
            return res.status(400).send({
                message: 'Você já se candidatou a esta vaga!'
            });
        }

        const novaCandidatura = new Candidatura({
            candidato: candidato._id,
            vaga: vaga._id,
            empresa: vaga.empresa._id,
            status: 'Pendente'
        });

        await novaCandidatura.save();

        // Converte a imagem em Base64 (se existir)
        let imagemBase64 = null;
        if (vaga.imagem && vaga.imagem.data) {
            imagemBase64 = `data:${vaga.imagem.contentType};base64,${vaga.imagem.data.toString('base64')}`;
            console.log("Imagem convertida para Base64.");
        }

        res.redirect(`/candidato/${candidatoId}/candidaturas?success=true`)

    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao realizar a candidatura!',
            error: erro.message
        });
    }
};

// Renderiza a página de detalhes de uma candidatura
const verCandidatura = async (req, res) => {
    try {
        const {
            id
        } = req.params;

        const candidatura = await Candidatura.findById(id)
            .populate({
                path: 'vaga',
                populate: {
                    path: 'empresa'
                }
            })
            .populate('candidato');

        // Verifica se a candidatura foi encontrada
        if (!candidatura) {
            return res.status(404).send({
                message: 'Candidatura não encontrada!'
            });
        }

        // Verifica se os dados necessários estão disponíveis
        if (!candidatura.vaga || !candidatura.candidato) {
            return res.status(400).send({
                message: 'Dados incompletos na candidatura!'
            });
        }

        // Converte a imagem da vaga em Base64 (se existir)
        let imagemBase64 = null;
        if (candidatura.vaga.imagem && candidatura.vaga.imagem.data) {
            imagemBase64 = `data:${candidatura.vaga.imagem.contentType};base64,${candidatura.vaga.imagem.data.toString('base64')}`;
        }

        res.render('can/candidatura', {
            title: 'Candidatura',
            vagaNome: candidatura.vaga.nome || 'Não informado',
            vagaArea: candidatura.vaga.area || 'Não informado',
            vagaRequisitos: candidatura.vaga.requisitos || 'Não informado',
            empresa: candidatura.vaga.empresa?.nome || 'Não informado',
            candidatoNome: candidatura.candidato.nome || 'Não informado',
            status: candidatura.status || 'Não informado',
            imagem: imagemBase64,
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao renderizar a página da candidatura!',
            error: erro.message
        });
    }
};

// Deleta uma candidatura
const cancelarCandidatura = async (req, res) => {
    try {
        const candidaturaId = req.params.candidaturaId;
        const candidatoId = req.params.candidatoId;
        const candidatura = await Candidatura.findByIdAndDelete(candidaturaId)

        if (!candidatura) {
            return res.status(400).send({
                message: 'Candidatura não encontrada!'
            });
        }

        res.redirect(`/candidato/${candidatoId}/candidaturas?success=true`);
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao cancelar a candidatura!',
            error: erro.message
        });
    }
};

// Atualiza o perfil
const updatePerfil = async (req, res) => {
    try {
        const candidatoId = req.params.candidatoId;
        const {
            nome,
            cpf,
            email,
            telefone,
            educacao,
            qualificacao,
            cursos,
            descricao,
            habilidades,
            idiomas
        } = req.body;
        const candidato = await Candidato.findById(candidatoId);

        if (!candidato) {
            return res.status(404).send({
                message: 'Candidato não encontrado!'
            });
        }

        candidato.nome = nome || candidato.nome;
        candidato.cpf = cpf || candidato.cpf;
        candidato.email = email || candidato.email;
        candidato.telefone = telefone || candidato.telefone;
        candidato.educacao = educacao || candidato.educacao;
        candidato.qualificacao = qualificacao || candidato.qualificacao;
        candidato.cursos = cursos || candidato.cursos;
        candidato.descricao = descricao || candidato.descricao;
        candidato.habilidadesTecnicas = habilidades || candidato.habilidadesTecnicas;
        candidato.idiomas = idiomas || candidato.idiomas;

        // Verificar se uma nova imagem foi enviada
        if (req.file && req.file.path) {
            candidato.imagem = req.file.path;
        }

        await candidato.save();

        res.redirect(`/candidato/perfil/${candidatoId}`);
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao editar o perfil!',
            error: erro.message
        });
    }
};

module.exports = {
    dashboardCandidato,
    getCadastroCandidato,
    getPerfilCandidato,
    cadastrarCandidato,
    verVaga,
    buscarVagas,
    candidatarAVaga,
    verCandidatura,
    cancelarCandidatura,
    updatePerfil,
    isAuthenticated
};