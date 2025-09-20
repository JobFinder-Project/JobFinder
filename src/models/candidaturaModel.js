const mongoose = require('mongoose');

// Definição do modelo de uma Candidatura
const relacaoSchema = new mongoose.Schema({
    candidato: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidato',
        required: true
    },
    vaga: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vagas',
        required: true
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true
    },
    status: {
        type: String,
        enum: ['Pendente', 'Aceito', 'Rejeitado'],
        default: 'Pendente'
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('Candidatura', relacaoSchema);