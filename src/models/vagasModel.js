const mongoose = require('mongoose');

// Definição do modelo de uma Vaga
const VagasSchema = new mongoose.Schema({
    nome: String,
    area: String,
    requisitos: String,
    imagem: {
        data: Buffer,
        contentType: String
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Empresa'
    }
});

module.exports = mongoose.model('Vagas', VagasSchema);