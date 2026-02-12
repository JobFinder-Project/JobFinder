import 'dotenv/config';
import app from './src/app.js';
import connectDb from './src/db.js';

const PORT = 3000;

// Conexão com o banco e com o servidor
connectDb()
  // eslint-disable-next-line no-unused-vars
  .then((data) => {
    console.log(' >> Banco de dados conectado com sucesso:\n');
    app
      .listen(PORT, () => {
        console.log(`>> Servidor rodando na porta http://localhost:${PORT}/home\n`);
      })
      .on('error', (err) => console.log('Erro ao ligar o servidor:\n', err));
  })
  .catch((err) => console.log('Nao foi possivel conectar ao Banco de Dados:\n', err));
