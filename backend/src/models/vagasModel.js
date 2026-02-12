import mongoose from 'mongoose';

// Definição do modelo de uma Vaga
const VagasSchema = new mongoose.Schema({
  nome: String,
  area: String,
  requisitos: String,
  imagem: {
    data: Buffer,
    contentType: String,
  },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
  },
});

export default mongoose.model('Vagas', VagasSchema);
