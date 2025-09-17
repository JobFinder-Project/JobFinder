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

        const candidatos = await candidato.find();
        console.log('Produtos encontrados:', candidatos);

        // Converte a imagem em Base64 (se existir)
        const candidatosComImagens = candidatos.map(c => {
            let imagemBase64 = null;
            if (c.imagem && c.imagem.data) {
                imagemBase64 = `data:${c.imagem.contentType};base64,${c.imagem.data.toString('base64')}`;
            }
            return { ...c._doc, imagem: imagemBase64 };
        });


        res.render('fun/empresaDashboard', {
            title: 'Dashboard',
            user: req.session.user,
            message: 'Bem-vindo ao seu painel, Empresa!',
            style: 'empresaDashboar.css',
            empresaId,
            candidatos: candidatosComImagens
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
const getEmpresa = async (req, res) => {
    try {
        const {
            empresaId
        } = req.params;
        const empresa = await Empresa.findById(empresaId);

        // Verifica se a empresa existe
        if (!empresa) {
            res.status(404).json({
                message: "Empresa não encontrada!"
            })
        }

        res.render('can/getPerfil', {
            title: empresa.nome,
            style: 'getPerfilCand.css',
            user: empresa,
            id: empresa._id
        })
    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao renderizar a página de perfil da empresa!',
            error: erro.message
        });
    }
}

// Salva uma nova Empresa no banco de dados (refatorado para service + JSON)
const { createEmpresa: createEmpresaService } = require('../services/empresaService');
const createEmpresa = async (req, res) => {
    try {
        const empresa = await createEmpresaService(req.body);
        return res.status(201).json({
            message: 'Cadastro realizado com sucesso!',
            id: empresa._id
        });
    } catch (erro) {
        console.error(erro);
        const status = erro.status || 500;
        return res.status(status).json({
            error: erro.message || 'Erro ao cadastrar a empresa.'
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
        const empresa = await Empresa.findByIdAndUpdate(empresaId);

        // Verifica se a empresa existe
        if (!empresa) {
            res.status(404).json({
                message: "Empresa não encontrada!"
            })
        }

        empresa.nome = nome || empresa.nome;
        empresa.cnpj = cnpj || empresa.cnpj;
        empresa.email = email || empresa.email;
        empresa.fone = fone || empresa.fone;
        empresa.bio = bio || empresa.bio;
        empresa.site = site || empresa.site;

        await empresa.save();

        res.redirect(`/empresa/${empresa._id}/perfil`)

    } catch (erro) {
        console.error(erro);
        res.status(500).send({
            message: 'Erro ao editar o perfil da empresa!',
            error: erro.message
        });
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
        const {
            empresaId
        } = req.params;
        const {
            nome,
            area,
            requisitos
        } = req.body;

        // Verifica se a empresa existe
        const empresa = await Empresa.findById(empresaId);
        if (!empresa) {
            return res.status(404).send({
                message: 'Empresa não encontrada!'
            });
        }

        const novaVaga = new Vagas({
            nome,
            area,
            requisitos,
            imagem: req.file ? {
                data: req.file.buffer,
                contentType: req.file.mimetype
            } : undefined,
            empresa: empresa._id
        });

        empresa.vagas.push(novaVaga._id);
        await novaVaga.save();
        await empresa.save();

        res.redirect(`/empresa/${empresaId}/vagas/criar?success=true`);
    } catch (erro) {
        console.error(erro);
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
    getEmpresa,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    dashboardEmpresa,
    criarVaga,
    buscarCandidatos,
    updateStatus,
}