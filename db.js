const mongoose = require('mongoose')
require('dotenv').config()

// Configuração do Banco de Dados
const dbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/JobFinder'

console.log('🔌 Conectando ao MongoDB:', dbUri)

module.exports = () => mongoose.connect(dbUri)