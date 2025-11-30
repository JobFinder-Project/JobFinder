const Candidato = require('../models/candidatoModel');
const Empresa = require('../models/empresaModel');
const Candidatura = require('../models/candidaturaModel');
const Vaga = require('../models/vagasModel');

// Renderiza a página Home
const getHome = async (req, res) => {
    try {
        res.render('fun/home', {
            title: 'Home',
            style: 'home.css'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Home',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página inicial!'
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
        res.status(500).render('paginaErro', {
            title: 'Erro na Escolha de Cargo',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página de escolha de cargos!'
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
        res.status(500).render('paginaErro', {
            title: 'Erro no Login',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página de login!'
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
        res.status(500).render('paginaErro', {
            title: 'Erro na Recuperação',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página Recuperar Senha!'
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
            // Aqui optamos por renderizar o erro também, pois é uma tela visual
            return res.status(400).render('paginaErro', {
                title: 'Token Inválido',
                style: 'paginaErro.css',
                status: 400,
                erro: 'Token não encontrado ou expirado',
                mensagem: 'O link de redefinição de senha é inválido ou já expirou.'
            });
        }

        res.render("fun/redefinirSenha", {
            title: "Redefinir Senha",
            style: "redefinirSenha.css",
            token
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro ao Redefinir',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página Redefinir Senha!'
        });
    }
};

// Retorna json de candidaturas 
// NOTA: Se esta rota for chamada via AJAX, o front receberá HTML de erro. Se for acesso direto, verá a tela bonita.
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
        res.status(500).render('paginaErro', {
            title: 'Erro ao buscar candidaturas',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Não foi possível carregar suas candidaturas.'
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
            // Adaptado para renderizar erro visual ao invés de JSON solto
            return res.status(404).render('paginaErro', {
                title: 'Nenhuma Candidatura',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'Candidaturas não encontradas!'
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
        res.status(500).render('paginaErro', {
            title: 'Erro na Lista de Candidaturas',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página Lista de Candidaturas!'
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
             return res.status(404).render('paginaErro', {
                title: 'Nenhum Candidato',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'Candidaturas não encontradas!'
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
        res.status(500).render('paginaErro', {
            title: 'Erro na Lista de Candidatos',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página Lista de Candidatos!'
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
             return res.status(404).render('paginaErro', {
                title: 'Vaga não encontrada',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'A vaga solicitada não existe ou foi removida.'
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
        res.status(500).render('paginaErro', {
            title: 'Erro nos Detalhes',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página da vaga!'
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
            return res.status(404).render('paginaErro', {
                title: 'Candidato não encontrado',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'O perfil do candidato não foi encontrado.'
            });
        }

        // converte a imagem do candidato para string para a view de edição
        let candidatoParaView = candidato.toObject();
        if (candidato && candidato.imagem && candidato.imagem.data) {
            candidatoParaView.imagem = `data:${candidato.imagem.contentType};base64,${candidato.imagem.data.toString('base64')}`;
        } else {
            candidatoParaView.imagem = null;
        }

        res.render('can/perfilEditar', {
            title: 'Edição de Perfil',
            style: 'perfilEditar.css',
            user: candidatoParaView,
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Edição',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página de edição do perfil do candidato!'
        });
    }
};

// Renderiza a página de Edição de Perfil da Empresa
const visualizarTelaEdicaoEmpre = async (req, res) => {
    try {
        const empresaId = req.params.empresaId;
        const empresa = await Empresa.findById(empresaId);

        // Verifica se a empresa existe
        if (!empresa) {
             return res.status(404).render('paginaErro', {
                title: 'Empresa não encontrada',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'O perfil da empresa não foi encontrado.'
            });
        }

        res.render('fun/perfilEditar', {
            title: 'Edição de Perfil',
            style: 'editarPerfilEmpresa.css',
            user: empresa,
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Edição',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página de edição do perfil da empresa!'
        });
    }
};

module.exports = {
    getHome,
    getCargo,
    getLogin,
    getRecuperarSenha,
    getRedefinirSenha,
    getVagaDetalhes,
    getCandidaturas,
    visualizarCandidaturas,
    visualizarCandidatos,
    visualizarTelaEdicaoCand,
    visualizarTelaEdicaoEmpre
}