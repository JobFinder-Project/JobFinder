const mongoose = require('mongoose')
const VagasSchema = require('./vagasModel')

// Definição do modelo de Empresa
const EmpresaSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Zá-ú��-��\s]+$/.test(v);
            },
            message: 'Nome inválido'
        },
    },
    cnpj: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(v);
            },
            message: 'CNPJ inválido'
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /\S+@\S+\.\S+/.test(v);
            },
            message: 'Email inválido'
        }
    },
    senha: {
        type: String,
        required: true,
        minlength: 8
    },
    fone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\(\d{2}\) \d{5}-\d{4}$/.test(v);
            },
            message: 'Telefone inválido'
        }
    },
    bio: {
        type: String,
        required: false,
    },
    site: {
        type: String,
        required: false,
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date
    },
    vagas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vagas'
    }]

});

module.exports = mongoose.model("Empresa", EmpresaSchema);