import mongoose from 'mongoose';

// Definição do modelo de uma Vaga
const VagasSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome da vaga é obrigatório'],
    trim: true,
    minlength: [3, 'O nome da vaga deve ter no mínimo 3 caracteres'],
    maxlength: [120, 'O nome da vaga deve ter no máximo 120 caracteres'],
  },
  area: {
    type: String,
    required: [true, 'A área da vaga é obrigatória'],
    trim: true,
    enum: {
      values: [
        'Comercial/Vendas',
        'Administrativa',
        'Gastronomia',
        'Logística',
        'Construção Civil',
        'Industrial',
        'Serviços Gerais',
        'Finanças',
        'Saúde',
        'TI - Tecnologia da Informação',
      ],
      message: 'Área {VALUE} inválida',
    },
  },
  requisitos: {
    type: String,
    required: [true, 'Os requisitos são obrigatórios'],
    trim: true,
    minlength: [10, 'Os requisitos devem ter no mínimo 10 caracteres'],
    maxlength: [1000, 'Os requisitos devem ter no máximo 1000 caracteres'],
  },
  imagem: {
    data: Buffer,
    contentType: String,
  },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Empresa',
    required: [true, 'A empresa é obrigatória'],
  },
});

export default mongoose.model('Vagas', VagasSchema);
