const mongoose =require('mongoose')

// Configuração do Banco de Dados
const dbUri = 'mongodb://localhost:27017/JobFinder'
module.exports = () => mongoose.connect(dbUri)