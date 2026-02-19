import mongoose from 'mongoose';
import { validators } from './globalValidator.js';

// Definição do modelo de Candidato
const candidatoSchema = mongoose.Schema({
  imagem: {
    data: Buffer,
    contentType: String,
  },
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true,
    minlength: [3, 'O nome deve conter no mínimo 3 caracteres'],
    maxlength: [50, 'O nome deve conter no máximo 50 caracteres'],
    validate: {
      validator: validators.isNome,
      message: 'Nome inválido',
    },
  },
  cpf: {
    type: String,
    required: [true, 'O CPF é obrigatório'],
    unique: true,
    validate: [
      {
        validator: validators.isCPF,
        message: 'CPF inválido',
      },
      {
        validator: validators.isCPFNotRepeated,
        message: 'CPF inválido',
      },
    ],
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validators.isEmail,
      message: 'Email fornecido é inválido',
    },
  },
  senha: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    minlength: [8, 'A senha deve ter no mínimo 8 caracteres'],
  },
  telefone: {
    type: String,
    required: [true, 'O telefone é obrigatório'],
    validate: {
      validator: validators.isPhoneBRFormatted,
      message: 'O número de telefone deve seguir o formato (XX) XXXXX-XXXX',
    },
  },
  educacao: {
    type: String,
    required: [true, 'O campo educação é obrigatória'],
    trim: true,
    minlength: [2, 'Educação deve ter no mínimo 2 caracteres'],
    maxlength: [120, 'Educação deve ter no máximo 120 caracteres'],
  },
  qualificacao: {
    type: String,
    required: false,
    trim: true,
    maxlength: [200, 'Qualificação deve ter no máximo 200 caracteres'],
  },
  cursos: {
    type: [String],
    required: false,
    default: [],
  },
  descricao: {
    type: [String],
    required: false,
  },
  habilidadesTecnicas: {
    type: [String],
    required: false,
    default: [],
  },
  idiomas: {
    type: [String],
    required: false,
    default: [],
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiration: {
    type: Date,
  },
});

export default mongoose.model('Candidato', candidatoSchema);
