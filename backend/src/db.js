import mongoose from 'mongoose';

// Configuração do Banco de Dados
//const dbUri = 'mongodb://localhost:27017/JobFinder'
const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  throw new Error('MONGO_URI não definida no ambiente');
}
export default () => mongoose.connect(dbUri);
