const Candidato = require('../models/candidatoModel');
const Empresa = require('../models/empresaModel');
const Candidatura = require('../models/candidaturaModel');
const Vaga = require('../models/vagasModel');
//const Vaga = require('../models/vagasModel');

// Renderiza a página Home
const getHome = async (req, res) => {
    try {
        res.render('fun/home', {
            title: 'Home',
            style: 'home.css'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página incial!',
            error: erro.messgae
        });
    }
}

// Renderiza a página da escolha de cargo
const getCargo = async (req, res) => {
    try {
        res.render('fun/escolherCargo', {
            title: 'Escolher Cargo',
            style: 'escolherCargo.css'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página de cargos!',
            error: erro.messgae
        });
    }
};

// Renderiza a página Login
const getLogin = async (req, res) => {
    try {
        res.render('fun/login', {
            title: 'Login',
            style: 'login.css'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página de login!',
            error: erro.messgae
        });
    }
};

// Renderiza a página de Recuperar Senha
const getRecuperarSenha = async (req, res) => {
    try {
        res.render('fun/esqueciSenha', {
            title: 'Recuperar Senha',
            style: 'esqueciSenha.css'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página Recuperar Senha!',
            error: erro.messgae
        });
    }
};

// Renderiza a página de Redefinição de Senha
const getRedefinirSenha = async (req, res) => {
    try {
        const token = req.params.token;

        const user =
            await Candidato.findOne({
                resetToken: token,
                resetTokenExpiration: {
                    $gt: Date.now()
                },
            }) ||
            await Empresa.findOne({
                resetToken: token,
                resetTokenExpiration: {
                    $gt: Date.now()
                },
            });

        // Verifica se o usuário existe
        if (!user) {
            return res.status(400).json({
                error: 'Token inválido ou expirado.'
            });
        }

        res.render("fun/redefinirSenha", {
            title: "Redefinir Senha",
            style: "redefinirSenha.css",
            token
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página Redefenir Senha!',
            error: erro.messgae
        });
    }
};

// Renderiza a página de Criação de Vagas
const getCriarVagas = (req, res) => {
    try {
        const {
            empresaId
        } = req.params;
        res.render('fun/criarVagas', {
            title: 'Criar Vagas',
            style: 'criarVagas.css',
            empresaId,
        })
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página Criar Vagas!',
            error: erro.messgae
        });
    }
};

// Renderiza a página de Vagas
const getVagas = async (req, res) => {
    try {
        const empresaId = req.params.empresaId;
        const empresa = await Empresa.findById(empresaId).populate('vagas');

        // Verifica se a empresa existe
        if (!empresa) {
            return res.status(404).json({
                message: 'Empresa não encontrada!'
            });
        }

        // Converte as imagens para Base64
        const vagasComImagens = empresa.vagas.map(vaga => {
            let imagemBase64 = null;
            if (vaga.imagem && vaga.imagem.data) {
                imagemBase64 = `data:${vaga.imagem.contentType};base64,${vaga.imagem.data.toString('base64')}`;
            }

            return {
                ...vaga._doc,
                imagem: imagemBase64,
            };
        });

        res.render('fun/vagas', {
            title: "Vagas",
            style: "vagas.css",
            vagas: vagasComImagens,
            empresaId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página Vagas!',
            error: erro.messgae
        });
    }
};

// Renderiza a página de Candidaturas
const getCandidaturas = async (req, res) => {
    try {
        const candidatoId = req.session.user.id;
        
        const candidaturas = await Candidatura.find({ candidato: candidatoId })
            .populate({
                path: 'vaga',
                select: 'nome area requisitos' 
            })
            .populate({
                path: 'empresa',
                select: 'nome'
            });
            
        if (!candidaturas || candidaturas.length === 0) {
            return res.status(200).json([]); 
        }

        res.status(200).json(candidaturas);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao buscar as candidaturas!',
            error: erro.message
        });
    }
};

// Renderiza a página de Candidatura
const visualizarCandidaturas = async (req, res) => {
    try {
        const candidatoId = req.params.candidatoId;

        const candidaturas = await Candidatura.find({
                candidato: candidatoId
            })
            .populate('candidato')
            .populate('vaga')
            .populate('empresa');

        // Verifica se há candidaturas para a vaga
        if (!candidaturas || candidaturas.length === 0) {
            return res.status(404).send({
                message: 'Candidaturas não encontradas!'
            });
        }

        // Converte as imagens para Base64
        const candidaturasComImagens = candidaturas.map(candidatura => {
            let imagemBase64 = null;
            if (candidatura.vaga.imagem && candidatura.vaga.imagem.data) {
                imagemBase64 = `data:${candidatura.vaga.imagem.contentType};base64,${candidatura.vaga.imagem.data.toString('base64')}`;
            }

            return {
                ...candidatura._doc,
                vaga: {
                    ...candidatura.vaga._doc,
                    imagem: imagemBase64
                }
            };
        });

        res.render('can/ver_candidaturas', {
            title: 'Lista de Candidaturas',
            style: 'verCandidatura.css',
            candidaturas: candidaturasComImagens,
            candidatoId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página Lista de Candidaturas!',
            error: erro.messgae
        });
    }
};

// Renderiza a página de Candidatos
const visualizarCandidatos = async (req, res) => {
    try {
        const empresaId = req.params.empresaId;
        const {
            id
        } = req.params;

        const candidaturas = await Candidatura.find({
            vaga: id
        }).populate('candidato').populate('vaga').populate('empresa');

        // Verifica se há candidaturas para a vaga
        if (!candidaturas) {
            return res.status(404).send({
                message: 'Candidaturas nao encontradas!'
            });
        }

        res.render('fun/candidatos_vagas', {
            title: 'Lista de Candidatos',
            style: 'repostacandidato.css',
            candidaturas,
            empresaId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página Lista de Candidatos!',
            error: erro.messgae
        });
    }

}

// Renderiza a página de detalhes de uma vaga
const getVagaDetalhes = async (req, res) => {
    try {
        const candidatoId = req.user._id;
        const vagaId = req.params.vagaId;

        const vaga = await Vaga.findById(vagaId).populate('empresa');

        // Verifica se a vaga existe
        if (!vaga) {
            return res.status(404).json({
                message: 'Vaga não encontrada!'
            });
        }

        res.render('fun/vagaDetalhes', {
            title: vaga.nome,
            style: 'vagaDetalhes.css',
            vaga,
            candidatoId
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página da vaga!',
            error: erro.messgae
        });
    }
};

// Renderiza a página de Edição de Perfil do Candidato
const visualizarTelaEdicaoCand = async (req, res) => {
    try {
        const candidatoId = req.params.candidatoId;
        const candidato = await Candidato.findById(candidatoId);

        // Verifica se o candidato existe
        if (!candidato) {
            return res.status(404).send('Candidato não encontrado');
        }

        res.render('can/perfilEditar', {
            title: 'Edição de Perfil',
            style: 'perfilEditar.css',
            user: candidato,
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página de edição do perfil do candidato!',
            error: erro.messgae
        });
    }
};

// Renderiza a página de Edição de Perfil da Empresa
const visualizarTelaEdicaoEmpre = async (req, res) => {
    try {
        const empresaId = req.params.empresaId;
        const empresa = await Empresa.findById(empresaId);

        // Verifica se o candidato existe
        if (!empresa) {
            return res.status(404).send('Empresa não encontrada');
        }

        res.render('fun/perfilEditar', {
            title: 'Edição de Perfil',
            style: 'editarPerfilEmpresa.css',
            user: empresa,
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            message: 'Erro ao renderizar a página de edição do perfil da empresa!',
            error: erro.messgae
        });
    }
};

module.exports = {
    getHome,
    getCargo,
    getLogin,
    getRecuperarSenha,
    getRedefinirSenha,
    getCriarVagas,
    getVagaDetalhes,
    getVagas,
    getCandidaturas,
    visualizarCandidaturas,
    visualizarCandidatos,
    visualizarTelaEdicaoCand,
    visualizarTelaEdicaoEmpre
}