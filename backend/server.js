const app = require('./app');
const connectDb = require('./db');
require('dotenv').config();

// Conexão com o banco e com o servidor
connectDb()
    .then(data => {
        console.log(' >> Banco de dados conectado com sucesso:\n')
        app.listen(3000, () => {
            console.log(`>> Servidor rodando na porta http://localhost:${3000}/home\n`)
        }).on('error', err =>
            console.log('Erro ao ligar o servidor:\n', err))
    })
    .catch(err => console.log('Nao foi possivel conectar ao Banco de Dados:\n', err))