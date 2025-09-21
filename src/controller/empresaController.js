const Empresa = require("../models/empresaModel");
const Vagas = require('../models/vagasModel');
const candidato = require("../models/candidatoModel");
const bcrypt = require("bcrypt");
const Candidatura = require("../models/candidaturaModel");
const Swal = require('sweetalert2');

// Renderiza a página de dashboard
const dashboardEmpresa = async (req, res) => {
    try {
        const empresaId = req.session.user.id;
        const empresa = await Empresa.findById(empresaId).populate('vagas');

        const candidatos = await candidato.find();
        // Converte a imagem em Base64 para candidatos
        const candidatosComImagens = candidatos.map(candidato => {
            let imagemBase64 = null;
            if (candidato.imagem && candidato.imagem.data) {
                imagemBase64 = `data:${candidato.imagem.contentType};base64,${candidato.imagem.data.toString('base64')}`;
            }
            return {
                ...candidato._doc,
                imagem: imagemBase64
            };
        });

        // Converte a imagem em Base64 para vagas
        const vagasComImagens = empresa && empresa.vagas ? empresa.vagas.map(vaga => {
            let imagemBase64 = null;
            if (vaga.imagem && vaga.imagem.data) {
                imagemBase64 = `data:${vaga.imagem.contentType};base64,${vaga.imagem.data.toString('base64')}`;
            }
            return {
                ...vaga._doc,
                imagem: imagemBase64,
            };
        }) : [];

        res.render('fun/empresaDashboard', {
            title: 'Dashboard',
            user: { ...empresa._doc, _id: empresaId },
            message: 'Bem-vindo ao seu painel, Empresa!',
            style: 'empresaDashboard.css',
            empresaId,
            candidatos: candidatosComImagens,
            vagas: vagasComImagens
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao renderizar a página dashboard da empresa!",
            error: erro.message
        });
    }
};

// Renderiza a página de cadastro de perfil
const getCadastroEmpresa = async (req, res) => {
    try {
        res.render('fun/reg_empresa', {
            title: 'Registro de Empresa',
            style: 'reg_empresa.css'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao renderizar a página de cadastro da empresa!",
            error: erro.message
        });
    }
};

// Renderiza a página do perfil
// const getEmpresa = async (req, res) => {
//     try {
//         const {
//             empresaId
//         } = req.params;
//         const empresa = await Empresa.findById(empresaId);

//         // Verifica se a empresa existe
//         if (!empresa) {
//             res.status(404).json({
//                 message: "Empresa não encontrada!"
//             })
//         }

//         res.render('can/getPerfil', {
//             title: empresa.nome,
//             style: 'getPerfilCand.css',
//             user: empresa,
//             id: empresa._id
//         })
//     } catch (erro) {
//         console.error(erro);
//         res.status(500).send({
//             message: 'Erro ao renderizar a página de perfil da empresa!',
//             error: erro.message
//         });
//     }
// }

// Salva uma nova Empresa no banco de dados
const createEmpresa = async (req, res) => {
    try {
        const empresa = await Empresa.findOne({
            cnpj: req.body.cnpj
        });
        
        // Verifica se há alguma empresa existente
        if (empresa) {
            return res.status(409).json({
                message: "Empresa já cadastrada!"
            })
        }
 
        const salt = await bcrypt.genSalt(12)
        const senhaHash = await bcrypt.hash(req.body.senha, salt)

        const newEmpresa = new Empresa({
            nome: req.body.nome,
            email: req.body.email,
            cnpj: req.body.cnpj,
            senha: senhaHash,
            fone: req.body.fone,
            bio: req.body.bio || "",
            site: req.body.site || ""
        });

        await newEmpresa.save();
        res.redirect('/login?cadastro=sucesso');

    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: "Erro ao cadastrar a empresa!",
            error: erro.message
        });
    }
}

// Atualiza o perfil
const updateEmpresa = async (req, res) => {
    try {
        const {
            nome,
            cnpj,
            email,
            fone,
            bio,
            site
        } = req.body;
        const {
            empresaId
        } = req.params;
        
        // Busca a empresa
        const empresa = await Empresa.findById(empresaId);

        // Verifica se a empresa existe
        if (!empresa) {
            return res.status(404).json({
                success: false,
                error: "Empresa não encontrada!"
            });
        }

        // Atualiza os campos
        empresa.nome = nome || empresa.nome;
        empresa.cnpj = cnpj || empresa.cnpj;
        empresa.email = email || empresa.email;
        empresa.fone = fone || empresa.fone;
        empresa.bio = bio || empresa.bio;
        empresa.site = site || empresa.site;

        // Salva as alterações
        await empresa.save();

        // Verifica o Content-Type da requisição
        const contentType = req.headers['content-type'];
        
        if (contentType && contentType.includes('application/json')) {
            // Resposta JSON para AJAX
            res.json({
                success: true,
                message: 'Perfil atualizado com sucesso!',
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
        } else {
            // Redirecionamento para form tradicional
            res.redirect(`/empresa/dashboard`);
        }

    } catch (erro) {
        console.error(erro);
        const contentType = req.headers['content-type'];
        
        if (contentType && contentType.includes('application/json')) {
            res.status(500).json({
                success: false,
                error: 'Erro ao editar o perfil da empresa: ' + erro.message
            });
        } else {
            res.status(500).send({
                message: 'Erro ao editar o perfil da empresa!',
                error: erro.message
            });
        }
    }
}

// Deleta o perfil
const deleteEmpresa = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const delEmpresa = await Empresa.findByIdAndDelete(id);

        // Verifica se a empresa existe
        if (!delEmpresa) {
            return res.status(404).json({
                message: "Empresa não encontrada!"
            });
        }

        res.status(200).json({
            message: "Empresa deletada com sucesso"
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao deletar a empresa!',
            error: erro.message
        });
    }
}

// Salva uma nova Vaga mo banco de dados
const criarVaga = async (req, res) => {
    try {
        const { empresaId } = req.params;
        const { nome, area, requisitos } = req.body;

        // Busca a empresa
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
            return res.status(404).json({
                success: false,
                error: 'Empresa não encontrada!'
            });
        }

        // Cria objeto da vaga seguindo o mesmo padrão do updateEmpresa
        const dadosVaga = {
            nome: nome,
            area: area, 
            requisitos: requisitos,
            empresa: empresa._id
        };

        // Adiciona imagem se existir
        if (req.file) {
            dadosVaga.imagem = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        // Cria nova vaga
        const novaVaga = new Vagas(dadosVaga);
        
        // Salva a vaga
        await novaVaga.save();
        
        // Adiciona vaga à empresa e salva
        empresa.vagas.push(novaVaga._id);
        await empresa.save();

        // Resposta de sucesso
        res.redirect('/empresa/dashboard?showVagas=true');
    } catch (erro) {
        console.error('Erro ao criar vaga:', erro);
        res.status(500).send({
            message: 'Erro ao criar vaga para a empresa!',
            error: erro.message
        });
    }
};

// Renderiza a página da lista de candidatos
const buscarCandidatos = async (req, res) => {
    try {
        const {
            q
        } = req.query;

        const candidatos = await candidato.find({
            $or: [{
                    qualificacao: {
                        $regex: q,
                        $options: 'i'
                    }
                },
                {
                    educacao: {
                        $regex: q,
                        $options: 'i'
                    }
                }
            ]
        });

        // Converte as imagens para Base64
        const candidatosComImagens = candidatos.map(candidato => {
            let imagemBase64 = null;
            if (candidato.imagem && candidato.imagem.data) {
                imagemBase64 = `data:${candidato.imagem.contentType};base64,${candidato.imagem.data.toString('base64')}`;
            }

            return {
                ...candidato._doc,
                imagem: imagemBase64,
            };
        });

        res.render('fun/resultCanddidatos', {
            candidatos: candidatosComImagens,
            query: q,
            title: 'Lista de Candidatos',
            style: 'buscacandidato.css'
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao buscar os candidatos da vaga!',
            error: erro.message
        });
    }
};

// Atualiza o status de uma candidatura
const updateStatus = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            status
        } = req.body;

        // Verifica se o status é válido
        if (!['Pendente', 'Aceito', 'Rejeitado'].includes(status)) {
            return res.status(400).send({
                message: 'Status inválido!'
            });
        }

        const candidaturaAtualizada = await Candidatura.findByIdAndUpdate(
            id, {
                status
            }, {
                new: true
            }
        );

        // Verifica se a candidatura existe
        if (!candidaturaAtualizada) {
            return res.status(404).send({
                message: 'Candidatura não encontrada!'
            });
        }

        res.redirect('/empresa/dashboard');
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao atualizar o status da candidatura da vaga!',
            error: erro.message
        });
    }
};

module.exports = {
    getCadastroEmpresa,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    dashboardEmpresa,
    criarVaga,
    buscarCandidatos,
    updateStatus,
}