const Empresa = require("../models/empresaModel");
const Vagas = require('../models/vagasModel');
const candidato = require("../models/candidatoModel");
const bcrypt = require("bcrypt");
const Candidatura = require("../models/candidaturaModel");
const Swal = require('sweetalert2');

// Função validação CNPJ
function validateCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, ''); // só números

    // verifica se tem 14 digitos
    if (cnpj.length !== 14) return false;

    // remove CNPJs com todos os dígitos iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    let resultado;

    // Cálculo do primeiro dígito verificador
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    // Cálculo do segundo dígito verificador
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
}

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
        res.status(500).render('paginaErro', {
            title: 'Erro no Dashboard',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: "Erro ao renderizar a página dashboard da empresa!"
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
        res.status(500).render('paginaErro', {
            title: 'Erro no Cadastro',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: "Erro ao renderizar a página de cadastro da empresa!"
        });
    }
};

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
        res.status(500).render('paginaErro', {
            title: 'Erro ao Cadastrar',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: "Erro ao cadastrar a empresa!"
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

        let cnpjNumerico;
        let foneNumerico;

        // validação de CNPJ
        if (cnpj !== undefined) {
            cnpjNumerico = cnpj.replace(/\D/g, '');

            if (cnpjNumerico.length !== 14){
                return res.status(400).json({
                    success: false,
                    error: "CNPJ deve conter 14 dígitos numéricos"
                });
            }
        
            if (!validateCNPJ(cnpjNumerico)) {
                return res.status(400).json({
                    success: false,
                    error: "CNPJ inválido, verifique os números digitados"
                });
            }
        }

        // validação de email
        if (email !== undefined) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)){
                return res.status(400).json({
                    success: false,
                    error: "Formato de email inválido"
                });
            }
        }

        // validação de telefone
        if (fone !== undefined) {
            foneNumerico = fone.replace(/\D/g, '');

            if (foneNumerico.length < 10 || foneNumerico.length > 11) {
                return res.status(400).json({
                    success: false,
                    error: "Telefone deve conter 10 ou 11 digitos"
                });
            }
        }

        // Atualiza os campos
        if (nome !== undefined) empresa.nome = nome;
        if (cnpj !== undefined) empresa.cnpj = cnpjNumerico;
        if (email !== undefined) empresa.email = email;
        if (fone !== undefined) empresa.fone = foneNumerico;
        if (bio !== undefined) empresa.bio = bio;
        if (site !== undefined) empresa.site = site;

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
        
        // Mantivemos a lógica condicional para não quebrar requisições AJAX que esperam JSON
        if (contentType && contentType.includes('application/json')) {
            res.status(500).json({
                success: false,
                error: 'Erro ao editar o perfil da empresa: ' + erro.message
            });
        } else {
            // Para requisições comuns, renderizamos a página de erro
            res.status(500).render('paginaErro', {
                title: 'Erro na Edição',
                style: 'paginaErro.css',
                status: 500,
                erro: erro.message || erro,
                mensagem: 'Erro ao editar o perfil da empresa!'
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
             return res.status(404).render('paginaErro', {
                title: 'Empresa não Encontrada',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: "Empresa não encontrada!"
            });
        }

        res.status(200).json({
            message: "Empresa deletada com sucesso"
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro ao Deletar',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao deletar a empresa!'
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
             return res.status(404).render('paginaErro', {
                title: 'Empresa não Encontrada',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'Empresa não encontrada!'
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
        res.redirect(`/empresa/dashboard?vagaCriada=true&empresaId=${empresaId}`);
    } catch (erro) {
        console.error('Erro ao criar vaga:', erro);
        res.status(500).render('paginaErro', {
            title: 'Erro ao Criar Vaga',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao criar vaga para a empresa!'
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
        res.status(500).render('paginaErro', {
            title: 'Erro na Busca',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao buscar os candidatos da vaga!'
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
             return res.status(400).render('paginaErro', {
                title: 'Status Inválido',
                style: 'paginaErro.css',
                status: 400,
                erro: 'Bad Request',
                mensagem: 'Status inválido!'
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
             return res.status(404).render('paginaErro', {
                title: 'Candidatura não Encontrada',
                style: 'paginaErro.css',
                status: 404,
                erro: 'Not Found',
                mensagem: 'Candidatura não encontrada!'
            });
        }

        res.redirect('/empresa/dashboard');
    } catch (erro) {
        console.error(erro);
        res.status(500).render('paginaErro', {
            title: 'Erro ao Atualizar',
            style: 'paginaErro.css',
            status: 500,
            erro: erro.message || erro,
            mensagem: 'Erro ao atualizar o status da candidatura da vaga!'
        });
    }
};

// Função de empresaRoust:

const getPerfil = async (req, res) => {
    
    try {
        const empresa = req.user;
        res.json({
            success: true,
            empresa: {
                _id: empresa._id,
                nome: empresa.nome,
                cnpj: empresa.cnpj,
                email: empresa.email,
                fone: empresa.fone,
                bio: empresa.bio || '',
                site: empresa.site || ''
            }
        });
    } catch (error) {
        // Como esta rota parece ser estritamente API (retorna JSON no success),
        // idealmente manteria JSON no erro. Mas seguindo a task de refatorar TODOS,
        // aqui vai a versão renderizada:
        res.status(500).render('paginaErro', {
            title: 'Erro no Perfil',
            style: 'paginaErro.css',
            status: 500,
            erro: error.message || error,
            mensagem: 'Erro ao buscar perfil da empresa'
        });
    }}

module.exports = {
    getCadastroEmpresa,
    createEmpresa,
    updateEmpresa,
    deleteEmpresa,
    dashboardEmpresa,
    criarVaga,
    buscarCandidatos,
    updateStatus,
    getPerfil
}