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
        const candidato = await Candidato.findById(candidatoId, '-senha');

        // Verifica se o candidato existe
        if (!candidato) {
            return res.status(404).send("Candidato não encontrado");
        }

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

        // Coleta apenas as areas únicas das vagas retornadas, sem duplicatas
        const areas = [...new Set(vagas.map(vaga => vaga.area))];

        // converte buffer do candidato para base64, se existir
        let candidatoParaRender;
        if (candidato && candidato.imagem && candidato.imagem.data) {
            candidatoParaRender = candidato.toObject(); // converte documento Mongoose em objeto simples
            candidatoParaRender.imagem = {
                contentType: candidato.imagem.contentType,
                data: candidato.imagem.data.toString('base64') // converte Buffer -> base64 string
            };
        } else {
            candidatoParaRender = candidato; // sem imagem
        }

        res.render('can/candidatoDashboard', {
            title: 'Dashboard',
            user: req.session.user,
            candidato: candidatoParaRender,
            inDashboard: true,
            style: 'candidatoDashboar.css',
            candidatoId,
            profileUpdated: req.query && req.query.updated === '1',
            vagas: vagasComImagens,
            areas
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro no Dashboard',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: "Erro ao renderizar a página dashboard do candidato!"
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
        res.status(500).render('paginaErro', {
            title: 'Erro no Cadastro',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: "Erro ao renderizar a página de registro do candidato!"
        });
    }
};

// Salva um novo Candidato no banco de dados
const cadastrarCandidato = async (req, res) => {
    try {
        const userExiste = await Candidato.findOne({
            email: req.body.email
        })

        // Verifica se o candidato existe 
        if (userExiste) {
            return res.status(422).json({
                mgs: "Email já utilizado no sistema. Por favor, escolher outro."
            })
        }
 
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(req.body.senha, salt)
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
        res.redirect('/home');
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro ao Cadastrar',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: "Erro ao cadastrar o candidato!"
        });
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
             return res.status(404).render('paginaErro', {
                title: 'Vaga não Encontrada',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'A vaga solicitada não existe.'
            });
        }

        // Converte a imagem em Base64 (se existir)
        let imagemBase64 = null;
        if (vaga.imagem && vaga.imagem.data) {
            imagemBase64 = `data:${vaga.imagem.contentType};base64,${vaga.imagem.data.toString('base64')}`;
        }

        res.status(200).json(vaga);
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Vaga',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página da vaga!'
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

        // Coleta apenas as areas únicas das vagas retornadas, sem duplicatas
        const areas = [...new Set(vagas.map(vaga => vaga.area))];

        res.render('can/resultVagas', {
            vagas: vagasComImagens,
            query: q,
            title: 'Lista de Vagas',
            areas,
            style: 'candidatoDashboar.css',
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Busca',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao buscar as vagas!'
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
             return res.status(400).render('paginaErro', {
                title: 'Não Autenticado',
                style: 'paginaErro.css',
                status: 400,
                erro: 'Unauthorized',
                mensagem: 'Usuário não autenticado!'
            });
        }

        // Busca a vaga pelo ID e popula os dados da empresa associada
        const vaga = await Vaga.findById(id).populate('empresa');
        if (!vaga) {
             return res.status(404).render('paginaErro', {
                title: 'Vaga não Encontrada',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'Vaga não encontrada!'
            });
        }

        // Busca o candidato pelo ID
        const candidato = await Candidato.findById(candidatoId);
        if (!candidato) {
             return res.status(404).render('paginaErro', {
                title: 'Candidato não Encontrado',
                style: 'paginaErro.css',
                status: 404,
                erro: 'User Not Found',
                mensagem: 'Candidato não encontrado!'
            });
        }

        // Verifica se já existe uma candidatura para essa vaga
        const candidaturaExistente = await Candidatura.findOne({
            candidato: candidato._id,
            vaga: vaga._id
        });
        if (candidaturaExistente) {
             return res.status(400).render('paginaErro', {
                title: 'Já Candidatado',
                style: 'paginaErro.css',
                status: 400,
                erro: 'Duplicate Entry',
                mensagem: 'Você já se candidatou a esta vaga!'
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

        res.redirect('/candidato/dashboard');

    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Candidatura',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao realizar a candidatura!'
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
             return res.status(404).render('paginaErro', {
                title: 'Candidatura não Encontrada',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'Candidatura não encontrada!'
            });
        }

        // Verifica se os dados necessários estão disponíveis
        if (!candidatura.vaga || !candidatura.candidato) {
             return res.status(400).render('paginaErro', {
                title: 'Dados Incompletos',
                style: 'paginaErro.css',
                status: 400,
                erro: 'Bad Data',
                mensagem: 'Dados incompletos na candidatura!'
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
            empresa: candidatura.vaga.empresa && candidatura.vaga.empresa.nome || 'Não informado',
            candidatoNome: candidatura.candidato.nome || 'Não informado',
            status: candidatura.status || 'Não informado',
            imagem: imagemBase64,
        });

    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Visualização',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao renderizar a página da candidatura!'
        });
    }
};

// Deleta uma candidatura
const cancelarCandidatura = async (req, res) => {
    try {
        const { candidaturaId } = req.params;

        const candidatura = await Candidatura.findByIdAndDelete(candidaturaId);

        if (!candidatura) {
             return res.status(404).render('paginaErro', {
                title: 'Erro ao Cancelar',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'Candidatura não encontrada!'
            });
        }
        
        res.status(200).json({ success: true, message: 'Candidatura cancelada com sucesso!' });

    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro no Cancelamento',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao cancelar a candidatura!'
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
             return res.status(404).render('paginaErro', {
                title: 'Candidato não Encontrado',
                style: 'paginaErro.css',
                status: 404,
                erro: 'User Not Found',
                mensagem: 'Candidato não encontrado!'
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
        if (req.file) {
            // Salva como Buffer + contentType
            candidato.imagem = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

    await candidato.save();

    // Redireciona para o dashboard com flag indicando sucesso na atualização
    res.redirect(`/candidato/dashboard?updated=1`);
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro na Atualização',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao editar o perfil!'
        });
    }
};

module.exports = {
    dashboardCandidato,
    getCadastroCandidato,
    cadastrarCandidato,
    verVaga,
    buscarVagas,
    candidatarAVaga,
    verCandidatura,
    cancelarCandidatura,
    updatePerfil,
    isAuthenticated
};